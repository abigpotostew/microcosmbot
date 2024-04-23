import { logContext } from '../../utils'
import { kickUser } from '../member/kick-member'
import bot from '../../bot'
import { botInfo } from '../../botinfo'
import { addAccountToGroup } from '../account/add-account-to-group'
import { prismaClient } from '@microcosms/db'
import { checkAccessRules } from '../access/access-rules'

export const verifyConnectNewWalletMenu = async ({
  code,
}: {
  code: string
}) => {
  //
  const otp = await prismaClient().pendingGroupMember.findFirst({
    where: {
      code,
    },
  })
  if (otp?.consumed || (otp?.expiresAt && otp.expiresAt < new Date())) {
    //

    return 'This link has expired. Use the invite link to restart your wallet verification.'
  }
  return `Your verification code is ${otp?.code}.\n\nOpen this URL and verify the one time code is the same before signing the verification message:\n\n${process.env.BASEURL}/verify/${otp?.code}\n\nDo not share this link with anyone.`
}

export const verifyWalletWithOtp = async ({
  otp,
  resolveAddress,
  setStatus,
  overwrite = false,
}: {
  otp: string
  resolveAddress: string
  setStatus: (status: number, body: any) => void
  overwrite?: boolean
}) => {
  const cl = logContext('verifyWalletWithOtp:' + otp)

  const now = new Date()
  cl.log('verifying wallet', otp, resolveAddress)
  //comapre the resolveaddress account to the otp group account
  const addressAccountPromise = prismaClient().wallet.findFirst({
    where: {
      address: resolveAddress,
    },
    include: {
      account: true,
    },
  })
  const existingPromise = prismaClient().pendingGroupMember.findFirst({
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
  const [existing, addressAccount] = await Promise.all([
    existingPromise,
    addressAccountPromise,
  ])
  if (!existing) {
    setStatus(401, { message: 'unauthorized' })
    cl.log('no pending non-expired group member found')
    return
  }
  //duplicate wallet check
  if (
    addressAccount?.accountId &&
    addressAccount.accountId !== existing.account.id &&
    !existing.consumed
  ) {
    if (!overwrite) {
      //this wallet is already registered to another TG account
      setStatus(200, { message: 'duplicate wallet' })
      return
    } else {
      //remove the wallet from the other account and continue
      //kick from all groups!!
      const groups = await prismaClient().groupMember.findMany({
        where: {
          accountId: addressAccount.accountId,
          active: false,
        },
        include: {
          group: true,
          account: true,
        },
      })
      for (let groupMember of groups) {
        try {
          await kickUser(groupMember.group, groupMember)
          cl.log(
            'Kicked user from group',
            groupMember.id,
            groupMember.group.groupId
          )
        } catch (e) {
          cl.error('error kicking user', groupMember.id, e)
        }
      }

      const count = await prismaClient().groupMember.updateMany({
        where: {
          accountId: addressAccount.accountId,
        },
        data: {
          active: false,
        },
      })
      cl.log('unlinked wallet from other accounts count:', count.count)
    }
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
    // no update if wallet already exists
    update: {},
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

  const { inviteLink } = await addAccountToGroup({
    account: existing.account,
    group: existing.group,
    cl,
  })
  if (inviteLink) {
    await bot.api.sendMessage(
      existing.account.userId.toString(),
      `You have successfully verified your wallet address ${resolveAddress}. Join the chat with your unique invite link ${inviteLink}`
    )
  } else {
    return bot.api.sendMessage(
      existing.account.userId.toString(),
      `You're already a member of this group.`
    )
  }
  setStatus(200, { message: 'ok', link: `https://t.me/${botInfo.username}` })
}

interface TokensMsg {
  owner: String
  start_after?: string
  limit: number
}
