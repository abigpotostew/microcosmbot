import { bot, commands } from '@microcosms/bot'
import { webhookCallback } from 'grammy'


bot.use(commands)

export default webhookCallback(bot, 'next-js', {
  secretToken: process.env.TG_WEBHOOK_SECRET,
})
