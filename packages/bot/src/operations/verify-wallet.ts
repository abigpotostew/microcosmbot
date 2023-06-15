import { Prisma, prismaClient } from '@microcosms/db'
import bot from '../bot'

export const verifyWallet = async ({
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
      expiresAt: {
        gte: now,
      },
      consumed: false,
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
    setStatus(401, { message: 'unauthorized' })
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
  setStatus(200, { message: 'ok' })
}
