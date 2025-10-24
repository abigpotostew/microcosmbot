import { Bot } from 'grammy'
import { botInfo } from '../botinfo'
import { MyContext } from './context'

export const bot = new Bot<MyContext>(process.env.TELEGRAM_BOT_KEY || '', {
  client: {},
  // let grammy fetch the bot info if not configured in env.
  botInfo: !botInfo.id ? undefined : botInfo,
})

export default bot
