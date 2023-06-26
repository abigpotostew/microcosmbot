import { prismaClient } from '@microcosms/db'

export const fetchInviteLink = async ({
  groupId,
}: {
  groupId: string | number
}) => {
  return prismaClient().group.findFirst({
    where: {
      groupId: groupId.toString(),
    },
  })
}
