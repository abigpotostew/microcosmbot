import { Group, prismaClient } from '@microcosms/db'
import crypto from 'crypto'

export const generateAdminLink = async (group: Group) => {
  const code = crypto.randomBytes(16).toString('hex')
  await prismaClient().manageGroupCode.create({
    data: {
      code,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      group: {
        connect: {
          id: group.id,
        },
      },
    },
  })
  return `${process.env.BASEURL}/manage-group/${code}`
}
