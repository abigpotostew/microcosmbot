import { Group, prismaClient } from '@microcosms/db'
import { CommandMiddleware, Context, InlineKeyboard } from 'grammy'
import { menuUserResponse } from '../../menus'
import * as crypto from 'crypto'
import { registerAccountToPendingGroupMember } from '../../operations/verify/register-account-to-pending-group-member'
import { responseSettings } from '../../operations/settings/settings'
import { logContext } from '../../utils/context'
import { MyContext } from '../../bot/context'
import { z } from 'zod'

const cuidSchema = z.object({
  groupId: z.string(),
})
/**
 * Starts the verify flow for a user.
 *
 * Normally this is done by the link
 * @param ctx
 */
const cmd_start: CommandMiddleware<MyContext> = async (
  ctx: MyContext
): Promise<void> => {
  const cl = logContext(ctx, 'cmd_start')
  const chat = ctx.chat
  const groupId = ctx.match?.toString()
  if (!chat) {
    return
  }

  if (chat.type === 'private') {
    if (!ctx.from || ctx.from.is_bot) {
      cl.log('unknown users or bot, skipping')
      return
    }

    if (ctx.match === 'true') {
      return responseSettings(ctx)
    }

    //check if they are trying to start the bot on their wallet
    const { success } = cuidSchema.safeParse({ groupId })
    if (!success) {
      await ctx.reply(
        'Invalid invite link. Please contact the group admin to get a new invite link.'
      )
      return
    }

    //check if they're already a member
    const group = await prismaClient().group.findFirst({
      where: {
        id: groupId,
        active: true,
      },
      include: {
        groupMembers: {
          where: {
            active: true,
            account: {
              userId: ctx.from.id.toString(),
            },
          },
          include: {
            account: true,
          },
        },
      },
    })

    if (!group) {
      await ctx.reply(
        "This group hasn't registered yet. Please contact the group admin to register."
      )
      return
    }
    if (group.groupMembers.length > 0) {
      await ctx.reply("You're already a member of this group.")
      return
    }

    await startUserVerifyFlow(ctx.from.id, group)
    const otp = await registerAccountToPendingGroupMember({
      ctx,
      fromTgId: ctx.from.id,
      groupJoinId: groupId!,
      group,
    })
    if (!otp) {
      return
    }

    // pass the otp code through to the menu
    ctx.match = otp.code

    const existingWallets = await prismaClient().wallet.findMany({
      where: {
        account: {
          id: otp.account.id,
        },
      },
    })
    let msg = `Hey and thanks for using MicroCosmBot! Connect a wallet to join '${group.name}'.`
    if (existingWallets.length > 0) {
      msg +=
        ' You have existing wallets. Would you like to use these wallets? Or connect a new wallet?'
    } else {
      msg += ' Please connect a new wallet.'
    }
    await ctx.reply(msg, {
      reply_markup: menuUserResponse,
    })
  } else if (chat.type !== 'supergroup') {
    await ctx.reply(
      "I only works in supergroups. Enable 'Chat history for new members' then invite me again."
    )
    await ctx.api.leaveChat(chat.id)
  }

  return
}

export const startUserVerifyFlow = (fromUserId: number, group: Group) => {
  const code = crypto.randomBytes(4).toString('hex')
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3)
  return prismaClient().pendingGroupMember.create({
    data: {
      code,
      expiresAt,
      group: {
        connect: {
          id: group.id,
        },
      },
      account: {
        connectOrCreate: {
          where: {
            userId: fromUserId.toString(),
          },
          create: {
            userId: fromUserId.toString(),
          },
        },
      },
    },
    include: {
      account: true,
    },
  })
}

export default cmd_start
