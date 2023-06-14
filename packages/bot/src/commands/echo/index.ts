import { Context, HearsMiddleware } from 'grammy'
import { MyContext } from '../../bot'

const echo: HearsMiddleware<MyContext> = async (
  ctx: MyContext
): Promise<void> => {
  console.log('echo chat is', ctx.chat)
  const chatMember = await ctx.chatMembers.getChatMember(
    ctx.chat.id,
    ctx.from.id
  )
  console.log('chatMember', chatMember)
  await ctx.reply((ctx.msg?.text || '') + 'chatMember: ' + chatMember?.user?.id)
}

export default echo
