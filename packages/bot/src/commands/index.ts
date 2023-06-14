import { Composer } from 'grammy'

import setup from './setup'
import echo from './echo'
import chat_member from './chat_member'

export const commands = new Composer()

commands.on('chat_member', chat_member)
// user joins a chat flow
commands.command('start', setup)
commands.hears(/echo *(.+)?/, echo)

//bot.on("my_chat_member"); // start, stop, join, or leave for the bot

export default commands
