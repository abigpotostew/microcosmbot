import { Group, prismaClient } from '@microcosms/db'
import { MyContext } from '../bot'

export const syncAdmins = async (
  ctx: MyContext,
  chatId: number,
  group?: Group | null
) => {
  //
  const admins = await ctx.api.getChatAdministrators(chatId)
  //store admins in db
  ///create accounts for admins if neded
  const accounts = await prismaClient().account.createMany({
    data: admins.map((a) => ({
      userId: a.user.id,
    })),
    skipDuplicates: true,
  })
  const adminAccounts = await prismaClient().account.findMany({
    where: {
      userId: {
        in: admins.map((a) => a.user.id),
      },
    },
  })
  if (!group) {
    group = await prismaClient().group.findFirst({
      where: {
        groupId: chatId,
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
}
