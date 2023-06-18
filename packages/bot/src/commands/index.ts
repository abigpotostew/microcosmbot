import { Composer } from 'grammy'

import cmd_start from './start'
import echo from './echo'
import chat_member from './chat_member'
import { bot, MyContext } from '../bot'
import { my_chat_member } from './my_chat_member'
import { registerMenus } from '../menus'
import { cmd_invite } from './invite'
import { cmd_settings } from './settings'
import { cmd_sync } from './sync'
import { cmd_me } from './me'
import { filterNewChatTitle } from '../filters/newChatTitle'

export const commands = new Composer<MyContext>()

registerMenus(commands)
commands.command('start', cmd_start)
commands.command('settings', cmd_settings)
commands.command('sync', cmd_sync)
commands.command('me', cmd_me)
commands.command('invite', cmd_invite)
commands.command('echo', echo)

commands.on('chat_member', chat_member)
commands.on('message:new_chat_title', filterNewChatTitle)
commands.on('my_chat_member', my_chat_member)
export default commands
