import { CommandMiddleware } from 'grammy'

import { MyContext } from '../../bot/context'
import { botInfo } from '../../botinfo'

const cmd_help: CommandMiddleware<MyContext> = async (
  ctx: MyContext
): Promise<void> => {
  if (ctx.chat?.type === 'private') {
    const startGroupLink = `https://telegram.me/${botInfo.username}?startgroup=true`
    await ctx.reply(
      `Welcome to MicroCosmBot!\n
To get started, add me to your private group with ${startGroupLink}. Then DM me /settings to configure the group access rules. Afterwards, ask me for the group /invite link to share with others. I'll take care of the rest.\n\nTo join a token gated group, ask a group admin for an invite link. For additional help, dm @abigpotostew on telegram.`
    )
    return
  } else if (ctx.chat?.type === 'group') {
    await ctx.reply(`Enable 'Visible chat history' to use me in this group.`)
  } else if (ctx.chat?.type === 'channel') {
    await ctx.reply(`I can't do anything in channels.`)
  } else if (ctx.chat?.type === 'supergroup') {
    await ctx.reply(
      `Welcome to MicroCosmBot! I help you easily create stargaze token gated groups.\n
To get started, add me to a group as an Admin. Then DM me /settings to configure the group access rules. Afterwards, ask me for the group /invite link to share with others. I'll take care of the rest.\n\nTo join a token gated group, ask a group admin for an invite link.`
    )
  }
}

export default cmd_help
