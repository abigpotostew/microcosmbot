import { Account, Group, prismaClient, Wallet } from '@microcosms/db'
import bot from '../bot'

export const addWalletToGroup = async ({
  wallet,
  group,
  account,
}: {
  wallet: Wallet
  group: Group
  account: Account
}) => {
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2) // 2 days
  // create a fresh invite link here for the user
  const link = await bot.api.createChatInviteLink(group.groupId.toString(), {
    creates_join_request: false,
    expire_date: Math.floor(expiresAt.getTime() / 1000),
    member_limit: 1,
  })
  const inviteLink = link.invite_link

  await bot.api.unbanChatMember(
    group.groupId.toString(),
    Number(account.userId)
  )
  // create a fresh invite link here for the user
  // store in the db
  //the user will be added with chat_members callback when they actually join

  return {
    expiresAt,
    inviteLink,
    groupMember: await prismaClient().groupMember.upsert({
      where: {
        GroupMember_walletId_groupId_unique: {
          walletId: wallet.id,
          groupId: group.id,
        },
      },
      create: {
        //save it as inactive until they actually join
        active: false,
        group: {
          connect: {
            id: group.id,
          },
        },
        wallet: {
          connect: {
            id: wallet.id,
          },
        },
        groupMemberInviteLink: {
          create: {
            inviteLink,
            expiresAt,
          },
        },
      },
      update: {
        //leave it as whatever active sate until they actually join they will be added again
        groupMemberInviteLink: {
          create: {
            inviteLink,
            expiresAt,
          },
        },
      },
    }),
  }
}
