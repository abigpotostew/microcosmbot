import { Bot, type Context } from 'grammy'
import { type ChatMembersFlavor } from '@grammyjs/chat-members'
import { botInfo } from '../botinfo'

export type MyContext = Context & ChatMembersFlavor

export const bot = new Bot<MyContext>(process.env.TELEGRAM_BOT_KEY || '', {
  client: {},
  // let grammy fetch the bot info if not configured in env.
  botInfo: !botInfo.id ? undefined : botInfo,
})

export default bot
