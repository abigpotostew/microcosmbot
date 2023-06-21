import { menuAdminConfig } from '../menus'
import { logContext } from '../utils'
import { MyContext } from '../bot/context'

export const responseSettings = async (ctx: MyContext): Promise<void> => {
  const cl = logContext(ctx)
  cl.log('settings!')
  await ctx.reply('Select a group to configure:', {
    reply_markup: menuAdminConfig,
  })
}
