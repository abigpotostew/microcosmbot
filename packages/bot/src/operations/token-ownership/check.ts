import { Account, Group, GroupMember, Wallet } from '@microcosms/db'

export const checkOwnership = async (
  group: Group,
  groupMember: GroupMember & { wallet: Wallet & { account: Account } }
) => {
  //
}
