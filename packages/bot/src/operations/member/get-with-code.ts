import { prismaClient } from '@microcosms/db'

export const getMemberAccountsAndWallets = (userId: string) => {
  return prismaClient().account.findFirst({
    where: {
      userId: userId.toString(),
    },
    include: {
      wallets: true,
    },
  })
}

// Grab the group and the member
export const getCodeGroupUser = (code: string, userId: string) => {
  return prismaClient().pendingGroupMember.findFirst({
    where: {
      code,
      account: {
        userId: userId.toString(),
      },
    },
    include: {
      group: {
        include: {
          groupTokenGate: true,
          groupMembers: {
            where: {
              active: true,
              account: {
                userId: userId.toString(),
              },
            },
            include: {
              account: true,
            },
          },
        },
      },
    },
  })
}

export const getGroupUserFromCode = (code: string, userId: string) => {
  return prismaClient().group.findFirst({
    where: {
      pendingGroupMembers: {
        some: {
          code,
        },
      },
    },
    include: {
      groupTokenGate: true,
      groupMembers: {
        where: {
          active: true,
          account: {
            userId: userId.toString(),
          },
        },
        include: {
          account: true,
        },
      },
    },
  })
}
