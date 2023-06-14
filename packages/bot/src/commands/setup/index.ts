import { Context } from 'grammy'

const users = {
  skymagic: 1445777026,
  stewdev01: 6100753315,
}

const setup = async (ctx: Context): Promise<void> => {
  // console.log('setup', ctx)
  const chat = ctx.chat
  const type = chat?.type

  if (!chat?.type || chat.type === 'private') {
    await ctx.reply(
      'Start not supported for this chat. Use a channel or group.'
    )
    return
  }
  // switch (type) {
  //   case 'group':
  //   case 'supergroup':
  //   case 'channel':
  //     break
  //   default:
  //     await ctx.reply(
  //       'Start not supported for this chat. Use a channel or group.'
  //     )
  //     return
  // }
  const user = await ctx.getAuthor()
  if (user.status !== 'administrator' && user.status !== 'creator') {
    await ctx.reply('You must be an admin to setup this bot.')
    return
  }

  const chatId = chat.id

  //now do the setup
  if (chat.type === 'group') {
  }
  //ctx.api.approveChatJoinRequest(chatId, ctx.from.id)
  //ctx.api.promoteChatMember(chatId, ctx.from.id)
  //remove member
  // ctx.api.banChatMember()
  //stew chat id
  console.log('chat', chat, chatId)

  //skymagic 1445777026
  //stew dev01 6100753315

  const chatLink = await ctx.api.exportChatInviteLink(chat.id)
  // const chatLink = await ctx.api.createChatInviteLink(chat.id, {
  // creates_join_request: false,
  // expire_date: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
  // member_limit: 1,
  // })
  console.log('created invite link: ', chatLink)

  // try {
  //   await ctx.api.approveChatJoinRequest(chat.id, users.stewdev01)
  // } catch (e) {
  //   if (e?.toString().includes('USER_ALREADY_PARTICIPANT')) {
  //     console.log('already approved')
  //   } else {
  //     console.log('error approving', e)
  //     //stopping. todo send a response to the user
  //     return
  //   }
  // }
  // console.log('approved join request')

  await ctx.api.unbanChatMember(chat.id, users.stewdev01)
  // ctx.api.setChatPermissions(chat.id, {
  //
  // })
  await ctx.api.sendMessage(
    users.stewdev01,
    'This is an invite link: ' + chatLink
  )
  console.log('sent message to dev account')
  //ctx.api.exportChatInviteLink()//not this, this is for primary only
  // ctx.api.approveChatJoinRequest()

  await ctx.reply('Hello, world! Setup')
}

export default setup
