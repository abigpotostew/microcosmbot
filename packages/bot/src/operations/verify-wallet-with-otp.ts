import { Group, GroupTokenGate, Prisma, prismaClient } from '@microcosms/db'
import bot, { MyContext } from '../bot'
import { botInfo } from '../botinfo'
import { getCodeGroupUser, getGroupUserFromCode } from './get-with-code'

export const verifyWalletWithOtp = async ({
  otp,
  resolveAddress,
  setStatus,
}: {
  otp: string
  resolveAddress: string
  setStatus: (status: number, body: any) => void
}) => {
  const now = new Date()
  console.log('verifying wallet', otp, resolveAddress)
  const existing = await prismaClient().pendingGroupMember.findFirst({
    where: {
      code: otp,
    },
    include: {
      group: true,
      account: true,
    },
  })
  if (!existing) {
    setStatus(401, { message: 'unauthorized' })
    console.log('no pending non-expired group member found')
    return
  }
  if (existing.consumed) {
    setStatus(401, { message: 'Already verified against this OTP' })
    console.log('pending group OTP already consumed')
    return
  }
  if (existing.expiresAt < now) {
    setStatus(401, { message: 'OTP expired. Please request a new invite.' })
    console.log('pending group OTP expired')
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
    console.log('pending group member already consumed')
    return
  }
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2) // 2 days
  // create a fresh invite link here for the user
  const link = await bot.api.createChatInviteLink(
    existing.group.groupId.toString(),
    {
      creates_join_request: false,
      expire_date: Math.floor(expiresAt.getTime() / 1000),
      member_limit: 1,
    }
  )
  const inviteLink = link.invite_link

  await bot.api.unbanChatMember(
    existing.group.groupId.toString(),
    Number(existing.account.userId)
  )

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
    update: {},
  })
  // Prisma.GroupMemberWhereUniqueInput
  await prismaClient().groupMember.upsert({
    where: {
      GroupMember_walletId_groupId_unique: {
        walletId: wallet.id,
        groupId: existing.group.id,
      },
    },
    create: {
      active: true,
      group: {
        connect: {
          id: existing.group.id,
        },
      },
      wallet: {
        connect: {
          id: wallet.id,
        },
      },
      groupMemberInviteLink: {
        create: {
          inviteLink,
          expiresAt,
        },
      },
    },
    update: {
      active: true,
      groupMemberInviteLink: {
        create: {
          inviteLink,
          expiresAt,
        },
      },
    },
  })
  //todo verify the nfts here

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
  console.log('adfasdas')
  const pendingCode = await getCodeGroupUser(code, userId.toString())
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

  if (!group?.groupMembers?.length) {
    //they are not a member of the group
    return null
  }
  const wallet = group.groupMembers[0].wallet
  console.log('group', JSON.stringify(group))
  for (const groupTokenGateElement of group.groupTokenGate) {
    if (
      !(await verifyWalletAgainstAccessRule({
        address: wallet.address,
        group,
        tokenGate: groupTokenGateElement,
      }))
    ) {
      console.log('wallet not allowed for rule', groupTokenGateElement)
      return false
    }
  }
  console.log('wallet is authorized to group')
  return true
}

interface TokensMsg {
  owner: String
  start_after?: string
  limit: number
}
const msgBase64 = (msg: TokensMsg) => {
  return Buffer.from(JSON.stringify({ tokens: msg })).toString('base64')
}

export const verifyWalletAgainstAccessRule = async ({
  address,
  group,
  tokenGate,
}: {
  address: string
  group: Group
  tokenGate: GroupTokenGate
}) => {
  //https://rest.stargaze-apis.com
  let ownedCount = 0
  const limit = 100
  const min = tokenGate.minTokens || 1
  const max = tokenGate.maxTokens
  const hasValidOwnedCount = (ownedCount: number) => {
    if (max) {
      return ownedCount >= min && ownedCount <= max
    }
    return ownedCount >= min
  }
  let start_after = undefined
  do {
    const msg = msgBase64({
      owner: address,
      limit,
      start_after,
    })
    const url = `${'https://rest.stargaze-apis.com'}/cosmwasm/wasm/v1/contract/${
      tokenGate.contractAddress
    }/smart/${msg}`
    console.log('url', url)
    // return false
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error('failed to fetch tokens')
    }
    const json = await res.json()
    const tokens = json.data?.tokens || []
    ownedCount += tokens.length
    if (tokens.length === 0 || tokens.length < limit) {
      break
    }
  } while (!hasValidOwnedCount(ownedCount))

  return hasValidOwnedCount(ownedCount)
}
