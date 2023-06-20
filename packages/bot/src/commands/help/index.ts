import { CommandMiddleware, Context, HearsMiddleware } from 'grammy'
import { MyContext } from '../../bot'

const cmd_help: CommandMiddleware<MyContext> = async (
  ctx: MyContext
): Promise<void> => {
  if (ctx.chat?.type === 'private') {
    await ctx.reply(
      `Welcome to MicroCosmBot!\n
To get started, add me to a group as an Admin. Then DM me /settings to configure the group access rules. Afterwards, ask me for the group /invite link to share with others. I'll take care of the rest.\n\nTo join a token gated group, ask a group admin for an invite link. For additional help, dm @abigpotostew on telegram.`
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
