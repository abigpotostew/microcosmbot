import { Account, Group, prismaClient, Wallet } from '@microcosms/db'
import bot from '../bot'
import { LogContext } from '../utils'

export const addWalletToGroup = async ({
  wallet,
  group,
  account,
  cl,
}: {
  wallet: Wallet
  group: Group
  account: Account
  cl: LogContext
}) => {
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 2) // 2 days
  let inviteLinkExisting = await prismaClient().groupMemberInviteLink.findFirst(
    {
      where: {
        consumedAt: null,
        groupMember: {
          account: {
            id: account.id,
          },
          group: {
            id: group.id,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }
  )

  if (inviteLinkExisting) {
    cl.log('revoking existing invite link:', inviteLinkExisting.inviteLink)
    try {
      await bot.api.revokeChatInviteLink(
        group.groupId.toString(),
        inviteLinkExisting.inviteLink
      )
    } catch (e) {
      cl.log("Couldn't revoke invite link", e)
    }
  }

  // create a fresh invite link here for the user
  const link = await bot.api.createChatInviteLink(group.groupId.toString(), {
    creates_join_request: false,
    expire_date: Math.floor(expiresAt.getTime() / 1000),
    member_limit: 1,
  })
  const inviteLink = link.invite_link

  // create a fresh invite link here for the user
  // store in the db
  // the user will be added with chat_members callback when they actually join

  return {
    expiresAt,
    inviteLink,
    groupMember: await prismaClient().groupMember.upsert({
      where: {
        GroupMember_accountId_groupId_unique: {
          accountId: account.id,
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
        account: {
          connect: {
            id: account.id,
          },
        },
        groupMemberInviteLink: {
          connectOrCreate: {
            where: {
              inviteLink,
            },
            create: {
              inviteLink,
              expiresAt,
            },
          },
        },
      },
      update: {
        //leave it as whatever active state until they actually join they will be added again
        groupMemberInviteLink: {
          connectOrCreate: {
            where: {
              inviteLink,
            },
            create: {
              inviteLink,
              expiresAt,
            },
          },
        },
      },
    }),
  }
}
