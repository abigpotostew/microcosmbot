import { Bot } from 'grammy'

const bot = new Bot(process.env.TELEGRAM_BOT_KEY || '', {
  client: {
    canUseWebhookReply: (m) => false,
  },

  //todo setup botInfo
})

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
export default bot
