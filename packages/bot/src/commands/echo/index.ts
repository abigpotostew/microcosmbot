import { CommandMiddleware } from 'grammy'

import { MyContext } from '../../bot/context'

/**
 * Echoes back the text sent to the bot. For debug purposes.
 * @param ctx
 */
const cmd_echo: CommandMiddleware<MyContext> = async (
  ctx: MyContext
): Promise<void> => {
  console.log('Echo chat is', ctx.chat)
  await ctx.reply(ctx.msg?.text || '')
}

export default cmd_echo
