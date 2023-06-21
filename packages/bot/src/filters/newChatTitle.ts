import { prismaClient } from '@microcosms/db'
import { logContext } from '../utils/context'
import { MyContext } from '../bot/context'

export const filterNewChatTitle = async (ctx: MyContext) => {
  if (!ctx?.message?.new_chat_title || !ctx.message.chat?.id) {
    return
  }

  const cl = logContext(ctx)
  await prismaClient().group.updateMany({
    where: {
      groupId: ctx.message.chat.id.toString(),
    },
    data: {
      name: ctx.message.new_chat_title,
    },
  })
  cl.log('updated group name', ctx.message.chat.id, ctx.message.new_chat_title)
}
