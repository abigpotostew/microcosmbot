import { prismaClient } from '@microcosms/db'
import { Context, Middleware } from 'grammy'
import { bot, MyContext } from '../../bot'
import { logContext } from '../../utils/context'

export const membershipInGroup = (
  status:
    | 'creator'
    | 'administrator'
    | 'member'
    | 'restricted'
    | 'left'
    | 'kicked'
) => {
  const directionsIn = ['creator', 'administrator', 'member']
  const directionsOut = ['restricted', 'left', 'kicked']
  if (directionsIn.includes(status)) {
    return 'in'
  }
  if (directionsOut.includes(status)) {
    return 'out'
  }
  return 'out'
}
const chat_member: Middleware<MyContext> = async (
  ctx: MyContext
): Promise<void> => {
  const lc = logContext(ctx)
  // lc.log('chat_member', JSON.stringify(ctx, null, 2))
  const chatMember = ctx.chatMember
  if (!chatMember) {
    return
  }
  const date = new Date(chatMember.date * 1000)
  await prismaClient().auditLog.create({
    data: {
      auditType: 'CHAT_MEMBER',
      groupId: chatMember.chat.id.toString(),
      data: JSON.parse(JSON.stringify(chatMember)),
      updateDate: date,
      updateId: ctx.update.update_id.toString(),
    },
  })

  const oldDirection = membershipInGroup(chatMember.old_chat_member.status)
  const newDirection = membershipInGroup(chatMember.new_chat_member.status)
  //they joined the group

  const [group, account] = await Promise.all([
    prismaClient().group.findFirst({
      where: {
        groupId: chatMember.chat.id.toString(),
      },
    }),
    // get or create account in case someone gets added to a group through invite link sharing
    prismaClient().account.upsert({
      where: {
        userId: chatMember.new_chat_member.user.id.toString(),
      },
      create: {
        userId: chatMember.new_chat_member.user.id.toString(),
      },
      update: {},
    }),
  ])
  lc.log(group ? 'found group ' + group.id : 'no group found')
  lc.log(account ? 'found account ' + account.id : 'no account found')

  //added to the group
  if (oldDirection === 'out' && newDirection === 'in') {
    lc.log('added to group')
    const dbInviteLink = await prismaClient().groupMemberInviteLink.findFirst({
      where: {
        groupMember: {
          account: {
            userId: ctx.chatMember.new_chat_member.user.id.toString(),
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
      await ctx.api.revokeChatInviteLink(
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
      lc.log('revoked chat link,', chatMember.invite_link.invite_link)
      const name =
        chatMember.new_chat_member.user.username ||
        chatMember.new_chat_member.user.first_name +
          ' ' +
          chatMember.new_chat_member.user.last_name
      // send welcome message to the group if they joined from the invite link
      await ctx.api.sendMessage(
        parseInt(dbInviteLink.groupMember.group.groupId),
        `@${name} has arrived`
      )
    }

    // await ctx.reply('Welcome to the group!')
  } else if (oldDirection === 'in' && newDirection === 'out') {
    // they left the group
    // remove them from the group in the db
    lc.log('here to remove')
    const res = await prismaClient().groupMember.updateMany({
      where: {
        group: {
          groupId: chatMember.chat.id.toString(),
        },
        account: {
          userId: ctx.chatMember.new_chat_member.user.id.toString(),
        },
        active: true,
      },
      data: {
        active: false,
      },
    })
    lc.log(
      'deleted group member from chat id',
      chatMember.chat.id,
      'member id',
      ctx.chatMember.new_chat_member.user.id,
      'result: ',
      res.count ? 'deleted' : 'no members to delete'
    )
  }
}

export default chat_member
