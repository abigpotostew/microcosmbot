import { Composer } from 'grammy'

import start from './start'
import echo from './echo'
import chat_member from './chat_member'
import { bot, MyContext } from '../bot'
import { my_chat_member } from './my_chat_member'
import { registerMenus } from '../menus'
import { cmd_invite } from './invite'
import { cmd_settings } from './settings'
import { cmd_sync } from './sync'

export const commands = new Composer<MyContext>()

registerMenus(commands)
commands.command('start', start)
commands.command('settings', cmd_settings)
commands.command('sync', cmd_sync)
commands.on('chat_member', chat_member)
// commands.on('message', (ctx) => {
//   console.log('message', ctx)
// })
// commands.on('message:left_chat_member:me', async (ctx) => {
//   const me = await ctx.api.getMe()
//   const isLeft = ctx.msg.left_chat_member === process.env.BOT_ID
//   console.log('i left this chat!')
// })
// commands.on('message:ad', async (ctx) => {
//   const me = await ctx.api.getMe()
//   const isLeft = ctx.msg.left_chat_member === process.env.BOT_ID
//   console.log('i left this chat!')
// })

commands.on('my_chat_member', my_chat_member)

// commands.on('message:join_chat_member:me', async (ctx) => {
//     const me = await ctx.api.getMe()
//     const isLeft = ctx.msg.left_chat_member === process.env.BOT_ID
//     console.log('i left this chat!')
// })
// user joins a chat flow
commands.hears(/echo *(.+)?/, echo)
// commands.on('callback_query', (ctx) => {
//   console.log(ctx)
// })
commands.command('invite', cmd_invite)

//bot.on("my_chat_member"); // start, stop, join, or leave for the bot

export default commands
