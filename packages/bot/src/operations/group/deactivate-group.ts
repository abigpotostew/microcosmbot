import { prismaClient } from '@microcosms/db'

export const deactivateChatGroup = async (groupChatId: string | number) => {
  await prismaClient().group.updateMany({
    where: {
      groupId: groupChatId.toString(),
    },
    data: {
      active: false,
    },
  })
}
