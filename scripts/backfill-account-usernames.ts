import 'dotenv/config'
import { prismaClient } from '../packages/db'
import { bot } from '../packages/bot/src/bot'

async function main() {
  const missingUsernames = await prismaClient().account.findMany({
    where: {
      username: null,
    },
  })
  for (let missingUsername of missingUsernames) {
    const user = await bot.api.getChat(missingUsername.userId)
    if (user.type === 'private') {
      const newUsername =
        user.username || `${user.first_name || ''} ${user.last_name || ''}`
      await prismaClient().account.update({
        where: {
          id: missingUsername.id,
        },
        data: {
          username: newUsername,
        },
      })
    }
  }
}
main()
