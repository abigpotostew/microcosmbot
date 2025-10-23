import { bot, commands } from '@microcosms/bot'
import { webhookCallback } from 'grammy'


bot.use(commands)

export default webhookCallback(bot, 'std/http', {
  secretToken: process.env.TG_WEBHOOK_SECRET,
})
