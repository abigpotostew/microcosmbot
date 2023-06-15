import { Group, prismaClient } from '@microcosms/db'
import { CommandMiddleware, Context, InlineKeyboard } from 'grammy'
import { Chat } from 'grammy/types'
import { MyContext } from '../../bot'
import { menuUserResponse } from '../../menus'
import * as crypto from 'crypto'
import { registerAccountToPendingGroupMember } from '../../operations/register-account-to-pending-group-member'
const users = {
  skymagic: 1445777026,
  stewdev01: 6100753315,
}

const start: CommandMiddleware<MyContext> = async (
  ctx: MyContext
): Promise<void> => {
  // console.log('setup', ctx)
  const chat = ctx.chat
  const type = chat?.type

  if (!chat) {
    return
  }
  // const myChatMember = ctx.myChatMember
  // if (!myChatMember) {
  //   return //ignore
  // }
  // todo store audit here

  if (chat.type === 'private') {
    if (!ctx.from || ctx.from.is_bot) {
      console.log('unknown users or bot, skipping')
      return //dunno who it's coming from
    }
    //check if they are trying to start the bot on their wallet
    if (typeof ctx.match !== 'string') {
      await ctx.reply(
        "I don't understand this command input. Invite me to a group to start."
      )
      return
    }

    const otp = await registerAccountToPendingGroupMember({
      ctx,
      fromTgId: ctx.from.id,
      groupJoinId: ctx.match!,
    })
    if (!otp) {
      return
    }

    ctx.match = otp.code

    const existingWallets = await prismaClient().wallet.findMany({
      where: {
        account: {
          id: otp.account.id,
        },
      },
    })
    let msg = 'Welcome to Microcosms Bot!'
    if (existingWallets.length > 0) {
      msg +=
        ' You have existing wallets. Would you like to use these wallets? Or connect a new wallet?'
    } else {
      msg += ' Please connect a new wallet.'
    }
    await ctx.reply(msg, {
      reply_markup: menuUserResponse,
    })
    //create a pending verification step.
    //register the user with the group
  } else if (chat.type !== 'supergroup') {
    // not a supergroup, exit the group
    await ctx.reply('This bot only works in supergroups. Exiting group.')
    await ctx.api.leaveChat(chat.id)
  }

  return

  // if (chat.type !== 'supergroup') {
  //   // not a supergroup, exit the group
  //   await ctx.reply('This bot only works in supergroups. Exiting group.')
  //   await ctx.api.leaveChat(chat.id)
  // }
  // let supergroup = chat as Chat.SupergroupChat
  // //supergroup
  // if (
  //   myChatMember.new_chat_member.status === 'left' ||
  //   myChatMember.new_chat_member.status === 'kicked'
  // ) {
  //   //remove it from db?
  //   const group = await prismaClient().group.findFirst({
  //     where: {
  //       groupId: myChatMember.chat.id,
  //     },
  //   })
  //   if (group) {
  //     await prismaClient().group.update({
  //       where: {
  //         id: group.id,
  //       },
  //       data: {
  //         active: false,
  //       },
  //     })
  //     console.log('removed from group!')
  //   }
  //   return
  // }
  //
  // const debugTesting = async () => {
  //   if (!chat?.type || chat.type === 'private') {
  //     await ctx.reply(
  //       'Start not supported for this chat. Use a channel or group.'
  //     )
  //     return
  //   }
  //   // switch (type) {
  //   //   case 'group':
  //   //   case 'supergroup':
  //   //   case 'channel':
  //   //     break
  //   //   default:
  //   //     await ctx.reply(
  //   //       'Start not supported for this chat. Use a channel or group.'
  //   //     )
  //   //     return
  //   // }
  //   const user = await ctx.getAuthor()
  //   if (user.status !== 'administrator' && user.status !== 'creator') {
  //     await ctx.reply('You must be an admin to setup this bot.')
  //     return
  //   }
  //
  //   const chatId = chat.id
  //
  //   //now do the setup
  //   if (chat.type === 'group') {
  //   }
  //   //ctx.api.approveChatJoinRequest(chatId, ctx.from.id)
  //   //ctx.api.promoteChatMember(chatId, ctx.from.id)
  //   //remove member
  //   // ctx.api.banChatMember()
  //   //stew chat id
  //   console.log('chat', chat, chatId)
  //
  //   //skymagic 1445777026
  //   //stew dev01 6100753315
  //
  //   const chatLink = await ctx.api.exportChatInviteLink(chat.id)
  //   // const chatLink = await ctx.api.createChatInviteLink(chat.id, {
  //   // creates_join_request: false,
  //   // expire_date: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
  //   // member_limit: 1,
  //   // })
  //   console.log('created invite link: ', chatLink)
  //
  //   // try {
  //   //   await ctx.api.approveChatJoinRequest(chat.id, users.stewdev01)
  //   // } catch (e) {
  //   //   if (e?.toString().includes('USER_ALREADY_PARTICIPANT')) {
  //   //     console.log('already approved')
  //   //   } else {
  //   //     console.log('error approving', e)
  //   //     //stopping. todo send a response to the user
  //   //     return
  //   //   }
  //   // }
  //   // console.log('approved join request')
  //
  //   await ctx.api.unbanChatMember(chat.id, users.stewdev01)
  //   // ctx.api.setChatPermissions(chat.id, {
  //   //
  //   // })
  //   await ctx.api.sendMessage(
  //     users.stewdev01,
  //     'This is an invite link: ' + chatLink
  //   )
  //   console.log('sent message to dev account')
  //   //ctx.api.exportChatInviteLink()//not this, this is for primary only
  //   // ctx.api.approveChatJoinRequest()
  // }
  //
  // await ctx.reply('Hello, world! Setup')
}

export const startUserVerifyFlow = (fromUserId: number, group: Group) => {
  const code = crypto.randomBytes(4).toString('hex')
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3)
  return prismaClient().pendingGroupMember.create({
    data: {
      code,
      expiresAt,
      group: {
        connect: {
          id: group.id,
        },
      },
      account: {
        connectOrCreate: {
          where: {
            userId: fromUserId,
          },
          create: {
            userId: fromUserId,
          },
        },
      },
    },
    include: {
      account: true,
    },
  })
}

export default start
