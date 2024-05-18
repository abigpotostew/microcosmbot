import { prismaClient } from '@microcosms/db'
import { LogContext } from '../../utils'
import { trackEvent } from '../../monitor/track-event'
import { MonitorEvents } from '../../monitor/monitor-events'

export const saveActiveGroup = async (
  groupToSave: {
    groupId: string | number
    title: string
  },
  cl: LogContext
) => {
  //create or activate the group
  const existingGroup = await prismaClient().group.findFirst({
    where: {
      groupId: groupToSave.groupId.toString(),
    },
    select: {
      id: true,
      groupId: true,
      active: true,
    },
  })
  if (existingGroup?.active) {
    cl.log(
      `Group ${existingGroup.id}:${existingGroup.groupId} is already active in the db`
    )
    return
  }

  //update the group to active
  const res = await prismaClient().group.upsert({
    where: {
      groupId: groupToSave.groupId.toString(),
    },
    create: {
      name: groupToSave.title,
      groupId: groupToSave.groupId.toString(),
      active: true,
    },
    update: {
      name: groupToSave.title,
      active: true,
    },
  })
  await trackEvent({
    event: MonitorEvents.GROUP_CREATED,
    group: { id: res.id, name: res.name },
  })
  return res
}
