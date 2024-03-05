import { prismaClient } from '@microcosms/db'

export const getAdminGroups = async ({ userId }: { userId: number }) => {
  return prismaClient().group.findMany({
    where: {
      groupAdmins: {
        some: {
          account: {
            userId: userId.toString(),
          },
        },
      },
    },
    include: {
      groupAdmins: {
        where: {
          account: {
            userId: userId.toString(),
          },
        },
      },
    },
  })
}

export const getAdminGroupsCount = async ({ userId }: { userId: number }) => {
  return prismaClient().group.count({
    where: {
      groupAdmins: {
        some: {
          account: {
            userId: userId.toString(),
          },
        },
      },
    },
  })
}
