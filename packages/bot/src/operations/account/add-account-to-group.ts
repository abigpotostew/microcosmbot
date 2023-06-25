import { Account, Group, prismaClient } from '@microcosms/db'
import bot from '../../bot'
import { LogContext } from '../../utils'

/**
 * Create a fresh invite link for a user to join a group, and send it to them.
 * The user will be added with chat_members callback when they actually join
 * @param group
 * @param account
 * @param cl logger
 */
export const addAccountToGroup = async ({
  group,
  account,
  cl,
}: {
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

  //if a user is already a member, just tell them to go to the group
  const existing = await prismaClient().groupMember.findFirst({
    where: {
      groupId: group.id,
      accountId: account.id,
      active: true,
    },
  })
  if (existing) {
    cl.log('user is already a member of group')
    return {
      groupMember: existing,
      inviteLink: null,
      expiresAt: null,
    }
  }

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
