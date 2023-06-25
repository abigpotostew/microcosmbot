import { Menu, MenuRange } from '@grammyjs/menu'
import { Composer } from 'grammy'
import { generateAdminLink } from '../operations/generate-admin-link'
import { logContext } from '../utils'
import { MyContext } from '../bot/context'
import { verifyExistingWallet } from '../operations/verify/verify-existing-wallet'
import { verifyConnectNewWalletMenu } from '../operations/verify/verify-wallet-with-otp'
import { getAdminGroups } from '../operations/admin/admin-groups'

export const menuUserResponse = new Menu<MyContext>('user-pm-menu')
  .text(
    {
      text: async (ctx) => 'Connect New Wallet',
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
      const reply = await verifyConnectNewWalletMenu({ code: ctx.match })
      return ctx.reply(reply)
    }
  )
  .row()
  .text(
    {
      text: 'Use Existing Wallets',
      payload: (ctx) => {
        // pass through the group id
        return typeof ctx.match === 'string' ? ctx.match : ''
      },
    },
    async (ctx) => {
      const cl = logContext(ctx)
      try {
        const reply = await verifyExistingWallet({
          cl,
          code: ctx.match!,
          userId: ctx.from.id,
        })
        return ctx.reply(reply)
      } catch (e) {
        cl.log('something went wrong. error', e)
        return ctx.reply('Something went wrong. Try the invite link again.')
      }
    }
  )

export const menuAdminConfig = new Menu<MyContext>('admin-config-menu').dynamic(
  async (ctx) => {
    const range = new MenuRange<MyContext>()
    const from = ctx.from
    if (!from) {
      await ctx.reply('You must be logged in to use this command.')
      return
    }
    const groups = await getAdminGroups({ userId: from.id })
    for (let group of groups) {
      range
        .text(group.name || group.id, async (ctx) => {
          const { link, durationMs } = await generateAdminLink(group)
          return ctx.reply(
            `Configure this group on your admin console:\n\n${link}\n\nThis link will expire in ${
              durationMs / 1000 / 60 / 60
            } hours. Do not share this link with anyone.`
          )
        })
        .row()
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
}
