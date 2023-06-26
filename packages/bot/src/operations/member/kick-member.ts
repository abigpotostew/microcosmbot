import { Account, Group, GroupMember, prismaClient } from '@microcosms/db'
import bot from '../../bot'

export const kickUser = async (
  group: Group,
  groupMember: GroupMember & { account: Account }
): Promise<void> => {
  await prismaClient().groupMember.update({
    where: {
      id: groupMember.id,
    },
    data: {
      active: false,
    },
  })
  await bot.api.banChatMember(
    group.groupId,
    parseInt(groupMember.account.userId)
  )
  await bot.api.sendMessage(
    parseInt(groupMember.account.userId),
    `You have been automatically removed from the group '${group.name}' because you no longer qualify for the group. Contact a group admin for more info.`
  )
}
