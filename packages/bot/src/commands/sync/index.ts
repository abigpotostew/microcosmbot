import { prismaClient } from '@microcosms/db'
import { CommandMiddleware } from 'grammy'
import { MyContext } from '../../bot'
import { syncAdmins } from '../../operations/sync-admins'

export const cmd_sync: CommandMiddleware<MyContext> = async (ctx) => {
  if (ctx.chat.type !== 'supergroup') {
    return ctx.reply('Message me in a registered group.')
  }
  const chatId = ctx.chat.id
  const group = await prismaClient().group.findFirst({
    where: {
      groupId: chatId,
    },
  })
  await syncAdmins(ctx, chatId, group)

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
  return ctx.reply(`Synced`)
}
