import { bot, commands } from '@microcosms/bot'
import { webhookCallback } from 'grammy'

export const config = {
  runtime: 'edge',
}

bot.use(commands)

export default webhookCallback(bot, 'std/http', {
  secretToken: process.env.TG_WEBHOOK_SECRET,
  onTimeout: 'return',
})
