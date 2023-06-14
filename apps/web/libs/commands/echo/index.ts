import { Context } from 'grammy'

const echo = async (ctx: Context): Promise<void> => {
  console.log('echo chat is', ctx.chat)
  await ctx.reply(ctx.msg?.text || '')
}

export default echo
