import { prismaClient } from '@microcosms/db'
import { Context, Middleware } from 'grammy'
import { MyContext } from '../../bot'

const membershipInGroup = (
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
  console.log('chat_member', JSON.stringify(ctx, null, 2))
  const chatMember = ctx.chatMember
  if (!chatMember) {
    return
  }
  const date = new Date(chatMember.date * 1000)
  await prismaClient().auditLog.create({
    data: {
      auditType: 'MY_CHAT_MEMBER',
      groupId: chatMember.chat.id,
      data: JSON.parse(JSON.stringify(chatMember)),
      updateDate: date,
      updateId: ctx.update.update_id,
    },
  })

  const oldDirection = membershipInGroup(chatMember.old_chat_member.status)
  const newDirection = membershipInGroup(chatMember.new_chat_member.status)
  //they joined the group
  if (oldDirection === 'out' && newDirection === 'in') {
    const dbInviteLink = await prismaClient().groupMemberInviteLink.findFirst({
      where: {
        groupMember: {
          wallet: {
            account: {
              userId: ctx.chatMember.new_chat_member.user.id.toString(),
            },
          },
        },
      },
      include: {
        groupMember: {
          include: {
            group: true,
            wallet: {
              include: {
                account: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    if (
      chatMember.invite_link?.invite_link &&
      chatMember.invite_link?.invite_link === dbInviteLink?.inviteLink
    ) {
      // revoke any invite links if it's in the db
      await ctx.api.revokeChatInviteLink(
        parseInt(dbInviteLink.groupMember.group.groupId),
        chatMember.invite_link.invite_link
      )
      console.log('revoked chat link,', chatMember.invite_link.invite_link)
      const name =
        chatMember.new_chat_member.user.username ||
        chatMember.new_chat_member.user.first_name +
          ' ' +
          chatMember.new_chat_member.user.last_name
      await ctx.api.sendMessage(
        parseInt(dbInviteLink.groupMember.group.groupId),
        `@${name} has arrived`
      )
    }
    //send welcome message to the group if they joined from the invite link

    // await ctx.reply('Welcome to the group!')
  } else if (oldDirection === 'in' && newDirection === 'out') {
    // they left the group
    // remove them from the group in the db
    const res = await prismaClient().groupMember.updateMany({
      where: {
        group: {
          groupId: chatMember.chat.id.toString(),
        },
        wallet: {
          account: {
            userId: ctx.chatMember.new_chat_member.user.id.toString(),
          },
        },
        active: false,
      },
      data: {
        active: false,
      },
    })
    console.log(
      'deleted group member from chat',
      chatMember.chat.id,
      ctx.chatMember.new_chat_member.user.id,
      res.count
    )
  }
  // const joined = ctx.chatMember.new_chat_member.status==='member'
}

export default chat_member
