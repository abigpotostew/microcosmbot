import { prismaClient } from '@microcosms/db'
import { CommandMiddleware } from 'grammy'
import { botInfo } from '../../botinfo'
import { MyContext } from '../../bot/context'
import { fetchInviteLink } from '../../operations/fetch-invite-link'

/**
 * Retrieves the invite link for the group.
 * @param ctx
 */
export const cmd_invite: CommandMiddleware<MyContext> = async (ctx) => {
  if (ctx.chat.type !== 'supergroup') {
    return ctx.reply('Invite only works in groups.')
  }
  const group = await fetchInviteLink({ groupId: ctx.chat.id.toString() })
  if (!group) {
    return ctx.reply(`This group isn't registered with MicroCosmBot.`)
  }
  if (!group.active) {
    return ctx.reply(
      `Please complete configuration of this group before inviting users.`
    )
  }
  return ctx.reply(
    `Invite users here by giving them this link: https://t.me/${botInfo.username}?start=${group.id}. Only users that pass your token rules will be able to join.`
  )
}
