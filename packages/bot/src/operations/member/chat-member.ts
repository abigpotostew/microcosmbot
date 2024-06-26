import { LogContext } from '../../utils'
import { ChatMemberUpdated } from 'grammy/types'
import { bot } from '../../bot'
import { prismaClient } from '@microcosms/db'

export const addMemberToGroup = async ({
  groupChatId,
  chatMember,
  lc,
}: {
  groupChatId: number
  chatMember: ChatMemberUpdated
  lc: LogContext
}) => {
  const [group, account] = await Promise.all([
    prismaClient().group.findFirst({
      where: {
        groupId: groupChatId.toString(),
      },
    }),
    // get or create account in case someone gets added to a group through invite link sharing
    prismaClient().account.upsert({
      where: {
        userId: chatMember.new_chat_member.user.id.toString(),
      },
      create: {
        userId: chatMember.new_chat_member.user.id.toString(),
        username: chatMember.new_chat_member.user.username,
      },
      update: {
        username: chatMember.new_chat_member.user.username,
      },
    }),
  ])
  lc.log(group ? 'found group ' + group.id : 'no group found')
  lc.log(account ? 'found account ' + account.id : 'no account found')

  lc.log('added to group')
  const dbInviteLink = await prismaClient().groupMemberInviteLink.findFirst({
    where: {
      groupMember: {
        account: {
          userId: chatMember.new_chat_member.user.id.toString(),
        },
      },
    },
    include: {
      groupMember: {
        include: {
          group: true,
          account: {
            include: {
              wallets: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  lc.log(
    'added to group with invite link id',
    dbInviteLink?.id,
    dbInviteLink?.inviteLink
  )
  let upsertPromises: Promise<any>[] = []
  if (chatMember.new_chat_member.status === 'administrator') {
    if (group && account) {
      lc.log('adding group admin')
      upsertPromises.push(
        prismaClient().groupAdmin.upsert({
          where: {
            groupId_accountId: {
              groupId: group.id,
              accountId: account.id,
            },
          },
          create: {
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
          },
          update: {},
        })
      )
    }
  }
  if (group?.id && dbInviteLink?.groupMember?.account?.id) {
    lc.log('marking group member as active')
    upsertPromises.push(
      prismaClient().groupMember.upsert({
        where: {
          GroupMember_accountId_groupId_unique: {
            groupId: group.id,
            accountId: dbInviteLink.groupMember.account.id,
          },
        },
        create: {
          active: true,
          group: {
            connect: {
              id: group.id,
            },
          },
          account: {
            connect: {
              id: dbInviteLink.groupMember.account.id,
            },
          },
        },
        update: {
          active: true,
        },
      })
    )
  }
  await Promise.all(upsertPromises)

  if (
    chatMember.invite_link?.invite_link &&
    chatMember.invite_link?.invite_link === dbInviteLink?.inviteLink
  ) {
    // revoke any invite links if it's in the db
    await bot.api.revokeChatInviteLink(
      parseInt(dbInviteLink.groupMember.group.groupId),
      chatMember.invite_link.invite_link
    )
    await prismaClient().groupMemberInviteLink.updateMany({
      where: {
        inviteLink: chatMember.invite_link.invite_link,
      },
      data: {
        consumedAt: new Date(),
      },
    })
    lc.log('chat link consumed', chatMember.invite_link.invite_link)
    const getChatName = () => {
      if (chatMember.new_chat_member.user.username) {
        return `@${chatMember.new_chat_member.user.username}`
      }
      let name = ''
      if (chatMember.new_chat_member.user.first_name) {
        name = chatMember.new_chat_member.user.first_name
      }
      if (chatMember.new_chat_member.user.last_name) {
        name =
          (name ? name + ' ' : '') + chatMember.new_chat_member.user.last_name
      }
      return name
    }
    const name = getChatName()
    // send welcome message to the group if they joined from the invite link
    await bot.api.sendMessage(
      parseInt(dbInviteLink.groupMember.group.groupId),
      getRandomGreeting(name)
    )
  }
}

const getRandomGreeting = (name: string) => {
  const greeting =
    randomGreetings[Math.floor(Math.random() * randomGreetings.length)]

  return greeting.replace('%%NAME%%', name)
}

//todo allow admins to configure this
const randomGreetings = [
  'Welcome %%NAME%% to the chat',
  '%%NAME%% has arrived',
  '%%NAME%% has joined the chat',
  '%%NAME%% has entered the chat',
  '%%NAME%% has joined the group',
  '%%NAME%% has entered the group',
  '%%NAME%% has joined the party',
  '%%NAME%% has entered the party',
  '%%NAME%% has joined the conversation',
  '%%NAME%% has entered the conversation',
  '%%NAME%% has joined the room',
  '%%NAME%% has entered the room',
]

/**
 * Remove a member from a group
 * @param userId
 * @param groupChatId
 * @param lc
 */
export const removeMemberToGroup = async ({
  userId,
  groupChatId,
  lc,
}: {
  userId: number
  groupChatId: number
  lc: LogContext
}) => {
  // they left the group
  // remove them from the group in the db
  lc.log('here to remove')
  const res = await prismaClient().groupMember.updateMany({
    where: {
      group: {
        groupId: groupChatId.toString(),
      },
      account: {
        userId: userId.toString(),
      },
      active: true,
    },
    data: {
      active: false,
    },
  })
  lc.log(
    'deactivate group member from chat id',
    groupChatId,
    'member id',
    userId,
    'result:',
    res.count ? 'deactivated' : 'no members to deactivate (skipping)'
  )
}
