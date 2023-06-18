import { prismaClient } from '@microcosms/db'

//Grab the group only if the userId is a memeber
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
              wallet: {
                account: {
                  userId: userId.toString(),
                },
              },
            },
            include: {
              wallet: true,
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
          // consumed: false,
          // expiresAt: {
          //   gt: new Date(),
          // },
        },
      },
    },
    include: {
      groupTokenGate: true,
      groupMembers: {
        where: {
          active: true,
          wallet: {
            account: {
              userId: userId.toString(),
            },
          },
        },
        include: {
          wallet: true,
        },
      },
    },
  })
}
