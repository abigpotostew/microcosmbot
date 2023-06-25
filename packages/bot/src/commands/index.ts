import { Composer } from 'grammy'
import cmd_start from './start'
import cmd_echo from './echo'
import on_chat_member from './chat_member'
import { on_my_chat_member } from './my_chat_member'
import { registerMenus } from '../menus'
import { cmd_invite } from './invite'
import { cmd_settings } from './settings'
import { cmd_sync } from './sync'
import { cmd_me } from './me'
import { filterNewChatTitle } from '../filters/newChatTitle'
import cmd_help from './help'
import { MyContext } from '../bot/context'

export const commands = new Composer<MyContext>()

registerMenus(commands)
commands.command('start', cmd_start)
commands.command('settings', cmd_settings)
commands.command('sync', cmd_sync)
commands.command('me', cmd_me)
commands.command('invite', cmd_invite)
commands.command('echo', cmd_echo)
commands.command('help', cmd_help)
commands.on('chat_member', on_chat_member)
commands.on('my_chat_member', on_my_chat_member)
commands.on('message:new_chat_title', filterNewChatTitle)

export default commands
