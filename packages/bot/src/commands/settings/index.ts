import { CommandMiddleware, Middleware } from 'grammy'
import { MyContext } from '../../bot'
import { menuAdminConfig } from '../../menus'

export const cmd_settings: CommandMiddleware<MyContext> = async (ctx) => {
  if (ctx.chat.type !== 'private') {
    return ctx.reply('DM me to configure your group.')
  }
  const from = ctx.from
  if (!from) {
    return
  }

  return ctx.reply('Select a group to configure:', {
    reply_markup: menuAdminConfig,
  })

  // // build a menu list of groups
  // return ctx.reply(
  //   `Invite users to this group with the following link: https://t.me/${botInfo.username}?start=${group.id}`
  // )
}
