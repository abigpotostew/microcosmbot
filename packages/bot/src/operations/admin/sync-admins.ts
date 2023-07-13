import { Group, prismaClient } from '@microcosms/db'

import { MyContext } from '../../bot/context'
import { logContext, tinyAsyncPoolAll } from '../../utils'

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
  const cl = logContext(ctx, 'syncAdmins')
  const admins = await ctx.api.getChatAdministrators(chatId)

  const accounts = await prismaClient().account.createMany({
    data: admins.map((a) => ({
      userId: a.user.id.toString(),
      username: a.user.username,
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

  const updateUsernames = async () => {
    const matchedAccounts = adminAccounts.map((aa) => {
      const matchedAdmin = admins.find(
        (admin) => admin.user.id.toString() === aa.userId
      )
      return { account: aa, admin: matchedAdmin }
    })
    // update usernames if needed
    const accountsNeedingUsernameUpdate = matchedAccounts.filter(
      (a) =>
        !a.account.username || a.admin?.user?.username !== a.account.username
    )
    if (accountsNeedingUsernameUpdate.length) {
      await tinyAsyncPoolAll(
        accountsNeedingUsernameUpdate,
        async ({ admin, account }) => {
          if (admin) {
            await prismaClient().account.update({
              where: {
                id: account.id,
              },
              data: {
                username: admin.user.username,
              },
            })
            cl.log(
              `updated username for ${account.userId} to ${admin.user.username}`
            )
          }
        },
        { concurrency: 3 }
      )
    }
  }
  await updateUsernames()

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
