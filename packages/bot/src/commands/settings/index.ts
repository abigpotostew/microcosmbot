import { CommandMiddleware } from 'grammy'
import { responseSettings } from '../../operations/settings/settings'
import { MyContext } from '../../bot/context'

/**
 * Returns a message to user to direct them to DM to manage group settings.
 * @param ctx
 */
export const cmd_settings: CommandMiddleware<MyContext> = async (ctx) => {
  if (ctx.chat.type !== 'private') {
    return ctx.reply('DM me to configure your group.')
  }
  const from = ctx.from
  if (!from) {
    return
  }

  return responseSettings(ctx)
}
