import { Menu } from '@grammyjs/menu'
import { MyContext } from '../bot'
import { Bot, Composer, InlineKeyboard } from 'grammy'
import { prismaClient } from '@microcosms/db'

// export const menuUserResponse = new InlineKeyboard()
//   .text('A', 'a-payload')
//   .row()
//   .url('B', 'https://skymagic.art')
export const menuUserResponse = new Menu<MyContext>('user-pm-menu')
  .text(
    {
      text: async (ctx) => 'Connect Wallet: ',
      payload: (ctx) => {
        // pass through the group id
        return typeof ctx.match === 'string' ? ctx.match : ''
      },
    },
    async (ctx) => {
      //start a group
      if (typeof ctx.match !== 'string') {
        return ctx.reply(
          'I dont understand this command input. Invite me to a group to start.'
        )
      }
      const otp = await prismaClient().pendingGroupMember.findFirst({
        where: {
          code: ctx.match,
        },
      })
      return ctx.reply(
        `Your one time password is \`${otp?.code}\`.\n\nOpen this URL and verify the password is the same in your browser before signing the verification message:\n\n${process.env.BASEURL}/verify/${otp?.code}`
      )
    }
  )
  .row()
  .text('Use Existing Wallets', (ctx) => {
    return ctx.reply('TODO!')
  })

const allMenus = [menuUserResponse]

export const registerMenus = (bot: Composer<MyContext>) => {
  for (let menu of allMenus) {
    bot.use(menu)
  }

  //this is for when we're not using the menu plugin
  // Wait for click events with specific callback data.
  // bot.callbackQuery('a-payload', async (ctx) => {
  //   await ctx.answerCallbackQuery({
  //     text: 'You were curious, indeed!',
  //   })
  // })
  // bot.on('callback_query:data', async (ctx) => {
  //   console.log('Unknown button event with payload', ctx.callbackQuery.data)
  //   await ctx.answerCallbackQuery() // remove loading animation
  // })
}
