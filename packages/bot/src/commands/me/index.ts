import { prismaClient } from '@microcosms/db'
import { CommandMiddleware, Middleware } from 'grammy'
import { MyContext } from '../../bot'
import { menuAdminConfig } from '../../menus'

export const cmd_me: CommandMiddleware<MyContext> = async (ctx) => {
  console.log('cmd_me', ctx)
  if (ctx.chat.type !== 'private') {
    return ctx.reply('DM me to run this commands :)')
  }
  const from = ctx.from
  if (!from) {
    return
  }

  const account = await prismaClient().account.findFirst({
    where: { userId: from.id.toString() },
    select: {
      id: true,
      wallets: {
        select: {
          address: true,
        },
      },
    },
  })
  if (!account) {
    return ctx.reply(
      'You have not registered yet. Get started by getting an invite link from a group admin.'
    )
  }
  if (!account.wallets.length) {
    return ctx.reply(
      'You have not connected any wallets yet. Get started by getting an invite link from a group admin.'
    )
  }
  return ctx.reply(
    `You have verified wallets 🎉\n ${account?.wallets
      .map((w) => w.address)
      .join('\n')}`
  )

  // // build a menu list of groups
  // return ctx.reply(
  //   `Invite users to this group with the following link: https://t.me/${botInfo.username}?start=${group.id}`
  // )
}
