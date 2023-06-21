import { CommandMiddleware, Middleware } from 'grammy'
import { menuAdminConfig } from '../../menus'
import { responseSettings } from '../../operations/settings'
import { MyContext } from '../../bot/context'

export const cmd_settings: CommandMiddleware<MyContext> = async (ctx) => {
  if (ctx.chat.type !== 'private') {
    return ctx.reply('DM me to configure your group.')
  }
  const from = ctx.from
  if (!from) {
    return
  }

  return responseSettings(ctx)

  // // build a menu list of groups
  // return ctx.reply(
  //   `Invite users to this group with the following link: https://t.me/${botInfo.username}?start=${group.id}`
  // )
}
