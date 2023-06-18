import {
  Account,
  Group,
  GroupMember,
  prismaClient,
  Wallet,
} from '@microcosms/db'
import bot from '../bot'

export const kickUser = async (
  group: Group,
  groupMember: GroupMember & { wallet: Wallet & { account: Account } }
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
    parseInt(groupMember.wallet.account.userId)
  )
  await bot.api.sendMessage(
    parseInt(groupMember.wallet.account.userId),
    `You have been kicked from the group ${group.name} because you no longer qualify for the group. Contact a group admin for more info.`
  )
}
