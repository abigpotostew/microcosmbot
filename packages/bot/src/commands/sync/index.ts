import { prismaClient } from '@microcosms/db'
import { CommandMiddleware } from 'grammy'
import { syncAdmins } from '../../operations/sync-admins'
import { isBotHasManagePermissions } from '../my_chat_member'
import { deactivateChatGroup } from '../../operations/deactivate-group'
import { logContext } from '../../utils/context'
import { MyContext } from '../../bot/context'

/**
 * Syncs the group's admins and settings with the database.
 * @param ctx
 */
export const cmd_sync: CommandMiddleware<MyContext> = async (ctx) => {
  const cl = logContext(ctx, 'cmd_sync')
  if (ctx.chat.type !== 'group' && ctx.chat.type !== 'supergroup') {
    return ctx.reply('This command only works in a group chat.')
  }
  const chatId = ctx.chat.id
  const group = await prismaClient().group.findFirst({
    where: {
      groupId: chatId.toString(),
    },
  })

  const admins = await syncAdmins(ctx, chatId, group)
  const meAdmin = admins.find((a) => a.user.id === ctx.me.id)

  if (meAdmin?.status === 'administrator') {
    if (!isBotHasManagePermissions(meAdmin)) {
      await deactivateChatGroup(chatId.toString())
    }
  } else {
    await deactivateChatGroup(chatId.toString())
    return ctx.reply('I need to be an admin to manage this group.')
  }

  if (group) {
    await prismaClient().group.update({
      where: {
        id: group.id,
      },
      data: {
        name: ctx.chat.title,
      },
    })
  }

  // build a menu list of groups
  return ctx.reply(`Synced :)`)
}
