import { prismaClient } from '@microcosms/db'
import { trackEvent } from '../../monitor/track-event'
import { MonitorEvents } from '../../monitor/monitor-events'

export const deactivateChatGroup = async (groupChatId: string | number) => {
  await prismaClient().group.updateMany({
    where: {
      groupId: groupChatId.toString(),
    },
    data: {
      active: false,
    },
  })
  const group = await prismaClient().group.findFirst({
    where: {
      groupId: groupChatId.toString(),
    },
    select: {
      id: true,
      name: true,
    },
  })
  if (group) {
    await trackEvent({
      event: MonitorEvents.GROUP_DELETED,
      group: { id: group.id, name: group.name },
    })
  }
}
