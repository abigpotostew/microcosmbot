import { prismaClient } from '@microcosms/db'

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
  // create a fresh invite link here for the user
  const inviteLink = ''
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days
  await prismaClient().groupMember.create({
    data: {
      group: {
        connect: {
          id: existing.group.id,
        },
      },
      wallet: {
        connectOrCreate: {
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
        },
      },
      groupMemberInviteLink: {
        create: {
          inviteLink,
          expiresAt,
        },
      },
    },
  })
}
