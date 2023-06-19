import { Group, GroupTokenGate, prismaClient, Wallet } from '@microcosms/db'
import bot, { MyContext } from '../bot'
import { botInfo } from '../botinfo'
import { getCodeGroupUser, getMemberAccountsAndWallets } from './get-with-code'
import { tinyAsyncPoolAll } from '../utils/async'
import { addWalletToGroup } from './add-wallet-to-group'
import { logContext, LogContext } from '../utils/context'
import { getOwnedCount } from './nft-ownership'

export const verifyWalletWithOtp = async ({
  otp,
  resolveAddress,
  setStatus,
}: {
  otp: string
  resolveAddress: string
  setStatus: (status: number, body: any) => void
}) => {
  const cl = logContext('verifyWalletWithOtp:' + otp)
  const now = new Date()
  cl.log('verifying wallet', otp, resolveAddress)
  const existing = await prismaClient().pendingGroupMember.findFirst({
    where: {
      code: otp,
    },
    include: {
      group: {
        include: {
          groupTokenGate: true,
        },
      },
      account: true,
    },
  })
  if (!existing) {
    setStatus(401, { message: 'unauthorized' })
    cl.log('no pending non-expired group member found')
    return
  }
  if (existing.consumed) {
    setStatus(401, { message: 'Already verified against this OTP' })
    cl.log('pending group OTP already consumed')
    return
  }
  if (existing.expiresAt < now) {
    setStatus(401, { message: 'OTP expired. Please request a new invite.' })
    cl.log('pending group OTP expired')
    return
  }
  const count = await prismaClient().pendingGroupMember.updateMany({
    where: {
      id: existing.id,
      consumed: false,
    },
    data: {
      consumed: true,
    },
  })
  if (count.count !== 1) {
    setStatus(401, { message: 'already verify with this OPT' })
    cl.log('pending group member already consumed')
    return
  }

  // todo check if someone esle already registered this wallet

  const wallet = await prismaClient().wallet.upsert({
    where: {
      address: resolveAddress,
    },
    create: {
      address: resolveAddress,
      account: {
        connect: {
          id: existing.account.id,
        },
      },
    },
    update: {}, //empty on purpose
  })

  //check if they qualify for the group with this wallet

  const allowed = await checkAccessRules(cl, existing.group, [wallet])
  if (!allowed) {
    cl.log('wallet does not pass token rules')
    await bot.api.sendMessage(
      existing.account.userId.toString(),
      `You have successfully verified your wallet address ${resolveAddress}. But your account does not pass the token rules for '${existing.group.name}'. Contact the group admin for more info.`
    )
    setStatus(200, {
      message: 'not passing rules',
      link: `https://t.me/${botInfo.username}`,
    })
    return
  }
  // Prisma.GroupMemberWhereUniqueInput
  const { inviteLink } = await addWalletToGroup({
    wallet,
    account: existing.account,
    group: existing.group,
  })

  await bot.api.sendMessage(
    existing.account.userId.toString(),
    `You have successfully verified your wallet address ${resolveAddress}. Join the group. ${inviteLink}`
  )
  setStatus(200, { message: 'ok', link: `https://t.me/${botInfo.username}` })
}

export const verifyExistingWallet = async ({
  ctx,
  code,
  userId,
}: // setStatus,
{
  ctx: MyContext
  code: string
  userId: number
  // setStatus: (status: number, body: any) => void
}) => {
  //get existing wallets,
  //check nfts against group access rules
  //stop if not allowed
  //create invite link if allowed
  const walletsPromise = getMemberAccountsAndWallets(userId.toString())
  const pendingCodePromise = getCodeGroupUser(code, userId.toString())
  const [account, pendingCode] = await Promise.all([
    walletsPromise,
    pendingCodePromise,
  ])
  if (!pendingCode) {
    return ctx.reply('Link expired. Please try the invite link again.')
  }
  if (pendingCode.group?.groupMembers?.length) {
    //they are a member of the group
    return ctx.reply(`You're already a member of this group.`)
  }
  if (pendingCode.consumed) {
    return ctx.reply('Link expired. Please try the invite link again.')
  } else if (pendingCode.expiresAt < new Date()) {
    return ctx.reply('Link expired. Please try the invite link again.')
  }
  const group = pendingCode.group

  if (!account?.wallets?.length) {
    //they are not a member of the group
    return ctx.reply(
      "You don't have any wallets yet. Try connecting a new wallet."
    )
  }
  const wallets = account.wallets

  const cl = logContext(ctx)

  const fw = await checkAccessRules(cl, group, wallets)
  if (!fw) {
    return ctx.reply(
      'None of your existing wallets are allowed to join this group. Did you connect a wallet that is allowed to join the group?'
    )
  }
  console.log('wallet is authorized to group')
  //add the wallet to the group
  const { inviteLink } = await addWalletToGroup({
    wallet: fw,
    account: account,
    group,
  })
  return ctx.reply(
    `You have successfully verified your wallet address ${fw.address}. Join the group. ${inviteLink}`
  )
}
type Pointer<T> = {
  value: T
}

interface TokensMsg {
  owner: String
  start_after?: string
  limit: number
}
const msgBase64 = (msg: TokensMsg) => {
  return Buffer.from(JSON.stringify({ tokens: msg })).toString('base64')
}

export const verifyWalletAgainstAccessRule = async (
  {
    address,
    group,
    tokenGate,
  }: {
    address: string
    group: Group
    tokenGate: GroupTokenGate
  },
  { useRemoteCache = false }: { useRemoteCache?: boolean } = {}
) => {
  const min = tokenGate.minTokens || 1
  const max = tokenGate.maxTokens
  const hasValidOwnedCount = (ownedCount: number) => {
    if (max) {
      return ownedCount >= min && ownedCount <= max
    }
    return ownedCount >= min
  }
  const ownedCount = await getOwnedCount({
    contractAddress: tokenGate.contractAddress,
    owner: address,
    useRemoteCache,
  })

  return hasValidOwnedCount(ownedCount)
}
export const checkAccessRules = async (
  cl: LogContext,
  group: Group & { groupTokenGate: GroupTokenGate[] },
  wallets: Wallet[],
  { useRemoteCache = false }: { useRemoteCache?: boolean } = {}
) => {
  const foundWallet: Pointer<Wallet | null> = { value: null }
  await tinyAsyncPoolAll(wallets, async (wallet) => {
    if (foundWallet.value) {
      return
    }
    for (const groupTokenGateElement of group.groupTokenGate) {
      if (
        !(await verifyWalletAgainstAccessRule(
          {
            address: wallet.address,
            group,
            tokenGate: groupTokenGateElement,
          },
          { useRemoteCache }
        ))
      ) {
        cl.log('wallet not allowed for rule', groupTokenGateElement)
        return
      }
    }
    //they qualify for all rules
    foundWallet.value = wallet
  })
  return foundWallet.value
}
