import { Account, PendingGroupMember, prismaClient } from '@microcosms/db'
import { MyContext } from '../bot'
import { startUserVerifyFlow } from '../commands/start'

//todo call this from the connect new wallet button
export const registerAccountToPendingGroupMember = async ({
  groupJoinId,
  fromTgId,
  ctx,
}: {
  ctx: MyContext
  fromTgId: number
  groupJoinId: string
}): Promise<(PendingGroupMember & { account: Account }) | null> => {
  const group = await prismaClient().group.findFirst({
    where: { id: groupJoinId!, active: true },
  })
  if (!group) {
    await ctx.reply(
      "This group hasn't registered yet. Please contact the group admin to register."
    )
    return null
  }
  return startUserVerifyFlow(fromTgId, group)
}
