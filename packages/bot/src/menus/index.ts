import { Menu, MenuRange } from '@grammyjs/menu'
import { MyContext } from '../bot'
import { Bot, Composer, InlineKeyboard } from 'grammy'
import { prismaClient } from '@microcosms/db'
import { generateAdminLink } from '../operations/generate-admin-link'

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

export const menuAdminConfig = new Menu<MyContext>('admin-config-menu').dynamic(
  async (ctx) => {
    const range = new MenuRange<MyContext>()
    const from = ctx.from?.id
    if (!from) {
      await ctx.reply('You must be logged in to use this command.')
      return
    }
    const groups = await prismaClient().group.findMany({
      where: {
        groupAdmins: {
          some: {
            account: {
              userId: from,
            },
          },
        },
      },
      include: {
        groupAdmins: {
          where: {
            account: {
              userId: from,
            },
          },
        },
      },
    })
    for (let group of groups) {
      range.submenu(
        {
          text: group.name || group.id,
          payload: (ctx) => {
            return group.id
          },
        },
        'admin-config-menu-submenu-group'
        // (ctx) => {
        //   ctx.match = group.id
        //   return ctx.reply('submenu middleware' + group.id)
        // }
      )
      // .text(group.name || group.id, async (ctx) => {
      //   const link = await generateAdminLink(group)
      //   return ctx.reply(`Configure your app here: ${link}`)
      // })
      // .row()
    }
    return range
  }
)

export const configureGroupSubmenu = new Menu<MyContext>(
  'admin-config-menu-submenu-group'
)
  .text('A Group', (ctx) => {
    return ctx.reply('match is: ' + ctx.match?.toString())
  })
  .back('Back to Groups')

menuAdminConfig.register(configureGroupSubmenu)

const rootMenus = [menuUserResponse, menuAdminConfig]

export const registerMenus = (bot: Composer<MyContext>) => {
  for (let menu of rootMenus) {
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
