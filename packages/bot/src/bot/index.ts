import { Bot, type Context, MemorySessionStorage } from 'grammy'
import { type ChatMember } from 'grammy/types'
import { chatMembers, type ChatMembersFlavor } from '@grammyjs/chat-members'
import { botInfo } from '../botinfo'

export type MyContext = Context & ChatMembersFlavor

const adapter = new MemorySessionStorage<ChatMember>()

export const bot = new Bot<MyContext>(process.env.TELEGRAM_BOT_KEY || '', {
  client: {
    // canUseWebhookReply: (m) => false,
  },
  botInfo: botInfo,

  //todo setup botInfo
})
// bot.use(chatMembers(adapter))

// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// Handle the /start command.
// bot.command('start', (ctx) => {
//   return ctx.reply('Welcome! Up and running.')
// })
// bot.command('echo', (ctx) => {
//   const msg = ctx.match
//   return ctx.reply(msg || '')
// })
// bot.hears(/echo *(.+)?/, (ctx) => {
//   return ctx.reply('Hi there!', {
//     // `reply_to_message_id` specifies the actual reply feature.
//     reply_to_message_id: ctx.msg.message_id,
//   })
// })

// attach all middleware
// bot.on('message', async (ctx) => {
//   await ctx.reply('Hi there!', {
//     // `reply_to_message_id` specifies the actual reply feature.
//     reply_to_message_id: ctx.msg.message_id,
//   })
// })
// bot.on('message', (ctx) => {
//   return ctx.reply('Got another message!')
// })

// console.log(
//   'starting bot',
//   process.env.TELEGRAM_BOT_KEY,
//   JSON.stringify(botInfo)
// )
export default bot
