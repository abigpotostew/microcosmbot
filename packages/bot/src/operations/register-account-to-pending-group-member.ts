import { Account, Group, PendingGroupMember } from '@microcosms/db'
import { startUserVerifyFlow } from '../commands/start'
import { MyContext } from '../bot/context'

export const registerAccountToPendingGroupMember = async ({
  fromTgId,
  group,
}: {
  ctx: MyContext
  fromTgId: number
  groupJoinId: string
  group: Group
}): Promise<(PendingGroupMember & { account: Account }) | null> => {
  return startUserVerifyFlow(fromTgId, group)
}
