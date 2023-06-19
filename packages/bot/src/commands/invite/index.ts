import { prismaClient } from '@microcosms/db'
import { CommandMiddleware } from 'grammy'
import { MyContext } from '../../bot'
import { botInfo } from '../../botinfo'

export const cmd_invite: CommandMiddleware<MyContext> = async (ctx) => {
  if (ctx.chat.type !== 'supergroup') {
    return ctx.reply('Invite only works in groups.')
  }
  const group = await prismaClient().group.findFirst({
    where: {
      groupId: ctx.chat.id.toString(),
    },
  })
  if (!group) {
    return ctx.reply(`This group isn't registered with MicroCosmBot.`)
  }
  if (!group.active) {
    return ctx.reply(
      `Please complete configuration of this group before inviting users.`
    )
  }
  return ctx.reply(
    `Invite users to this group with the following link: https://t.me/${botInfo.username}?start=${group.id}`
  )
}
