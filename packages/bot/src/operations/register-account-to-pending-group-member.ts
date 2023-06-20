import {
  Account,
  Group,
  PendingGroupMember,
  prismaClient,
} from '@microcosms/db'
import { MyContext } from '../bot'
import { startUserVerifyFlow } from '../commands/start'

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
