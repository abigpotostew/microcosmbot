import { MonitorEvent, MonitorEvents } from './monitor-events'
import { Err } from '../operations/daodao/get-daodao'

const groupMsg = (msg: string, group: { name: string }) => {
  return {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: msg,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `**${group.name}**`,
        },
      },
    ],
  }
}

const userMsg = (
  msg: string,
  group: { name: string },
  user: { name: string | null; address: string }
) => {
  return {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: msg,
          emoji: true,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `**${group.name}** - \`@${user.name}\` (${user.address})`,
        },
      },
    ],
  }
}

export const monitorEventToSlackFmt = async (event: MonitorEvent) => {
  if (event.event === MonitorEvents.GROUP_CREATED) {
    return groupMsg('A new group was created!', event.group)
  } else if (event.event === MonitorEvents.GROUP_UPDATED) {
    return groupMsg('A group was updated.', event.group)
  } else if (event.event === MonitorEvents.GROUP_DELETED) {
    return groupMsg('A group was delete.', event.group)
  } else if (event.event === MonitorEvents.USER_VERIFIED) {
    return userMsg(
      'A user was verified against a group.',
      event.group,
      event.user
    )
  } else if (event.event === MonitorEvents.USER_REJECTED) {
    return userMsg(
      'A user was rejected against a group.',
      event.group,
      event.user
    )
  } else {
    throw new Error('Invalid event type')
  }
}
