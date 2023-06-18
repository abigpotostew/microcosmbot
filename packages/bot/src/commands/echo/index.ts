import { CommandMiddleware, Context, HearsMiddleware } from 'grammy'
import { MyContext } from '../../bot'

const echo: CommandMiddleware<MyContext> = async (
  ctx: MyContext
): Promise<void> => {
  console.log('echo chat is', ctx.chat)
  // if (ctx.chat?.id && ctx.from?.id && ctx.chatMembers?.getChatMember) {
  //   const chatMember = await ctx.chatMembers.getChatMember(
  //     ctx.chat.id,
  //     ctx.from.id
  //   )
  //   console.log('chatMember', chatMember)
  //   await ctx.reply(
  //     (ctx.msg?.text || '') + 'chatMember: ' + chatMember?.user?.id
  //   )
  // } else {
  await ctx.reply(ctx.msg?.text || '')
  // }
}

export default echo
