import { Composer } from 'grammy'

import setup from 'libs/commands/setup'
import echo from 'libs/commands/echo'
import chat_member from 'libs/commands/chat_member'

const composer = new Composer()

composer.on('chat_member', chat_member)
// user joins a chat flow
composer.command('start', setup)
composer.hears(/echo *(.+)?/, echo)

//bot.on("my_chat_member"); // start, stop, join, or leave for the bot

export default composer
