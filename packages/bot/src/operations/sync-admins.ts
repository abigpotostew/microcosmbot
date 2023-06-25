import { Group, prismaClient } from '@microcosms/db'

import { MyContext } from '../bot/context'

/**
 * Store admins in db. Create accounts for admins if needed
 * @param ctx
 * @param chatId
 * @param group
 */
export const syncAdmins = async (
  ctx: MyContext,
  chatId: number,
  group?: Group | null
) => {
  //
  const admins = await ctx.api.getChatAdministrators(chatId)

  const accounts = await prismaClient().account.createMany({
    data: admins.map((a) => ({
      userId: a.user.id.toString(),
    })),
    skipDuplicates: true,
  })
  const adminAccounts = await prismaClient().account.findMany({
    where: {
      userId: {
        in: admins.map((a) => a.user.id.toString()),
      },
    },
  })
  if (!group) {
    group = await prismaClient().group.findFirst({
      where: {
        groupId: chatId.toString(),
      },
    })
  }
  const groupdbid = group?.id
  if (!groupdbid) {
    throw new Error(`Group ${chatId} not found in db`)
  }

  const existingAdmins = await prismaClient().groupAdmin.findMany({
    where: {
      groupId: groupdbid,
    },
  })

  const deletes: typeof existingAdmins = []
  for (let existingAdmin of existingAdmins) {
    if (!adminAccounts.find((a) => a.id === existingAdmin.accountId)) {
      deletes.push(existingAdmin)
    }
  }

  if (groupdbid) {
    await prismaClient().groupAdmin.createMany({
      data: adminAccounts.map((a) => ({
        groupId: groupdbid,
        accountId: a.id,
      })),
      skipDuplicates: true,
    })
    await prismaClient().groupMember.deleteMany({
      where: {
        id: {
          in: deletes.map((d) => d.id),
        },
      },
    })
  }
  return admins
}
