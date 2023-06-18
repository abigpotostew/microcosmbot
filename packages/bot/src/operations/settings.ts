import { menuAdminConfig } from '../menus'
import { MyContext } from '../bot'

export const responseSettings = async (ctx: MyContext): Promise<void> => {
  await ctx.reply('Select a group to configure:', {
    reply_markup: menuAdminConfig,
  })
}
