import Express, { Request, Response } from 'express'
import { webhookCallback } from 'grammy'
import { Bot } from 'grammy'

export const createBot = () => {
  // reate an instance of the `Bot` class and pass your bot token to it.
  const bot = new Bot(process.env.TELEGRAM_BOT_KEY || '', {
    client: {
      canUseWebhookReply: (m) => false,
    },
  }) // <-- put your bot token between the ""

  // You can now register listeners on your bot object `bot`.
  // grammY will call the listeners when users send messages to your bot.

  // Handle the /start command.
  bot.command('start', (ctx) => ctx.reply('Welcome! Up and running.'))
  // Handle other messages.
  bot.on('message', (ctx) => ctx.reply('Got another message!'))

  return bot
}

export const createBotServer = () => {
  const app = Express()
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000

  app.get('/status', (req: Request, res: Response) => {
    res.status(200).json({ ok: true })
  })

  // app.get(
  //   `/bot/${process.env.TELEGRAM_BOT_KEY}`,
  //   (req: Request, res: Response) => {
  //     res.status(200).json({ ok: true })
  //   }
  // )

  app.use(webhookCallback(createBot(), 'express'))

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}
