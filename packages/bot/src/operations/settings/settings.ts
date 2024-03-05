import { menuAdminConfig } from '../../menus'
import { logContext } from '../../utils'
import { MyContext } from '../../bot/context'
import { getAdminGroups, getAdminGroupsCount } from '../admin/admin-groups'

export const responseSettings = async (ctx: MyContext): Promise<void> => {
  const cl = logContext(ctx)
  cl.log('settings!')
  const from = ctx.from?.id
  if (!from) {
    await ctx.reply('You must be logged in to use this command.')
    return
  }
  const groupsCount = await getAdminGroupsCount({ userId: from })
  if (groupsCount === 0) {
    await ctx.reply(
      'You are not an admin of any group. Invite me to your group and make me an admin to configure it. To learn more, visit https://www.microcosmbot.xyz'
    )
    return
  }
  await ctx.reply('Select a group to configure:', {
    reply_markup: menuAdminConfig,
  })
}
