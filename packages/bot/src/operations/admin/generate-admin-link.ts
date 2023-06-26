import { Group, prismaClient } from '@microcosms/db'
import crypto from 'crypto'

export const generateAdminLink = async (group: Group) => {
  const code = crypto.randomBytes(16).toString('hex')
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 12)
  await prismaClient().manageGroupCode.create({
    data: {
      code,
      expiresAt,
      group: {
        connect: {
          id: group.id,
        },
      },
    },
  })
  return {
    link: `${process.env.BASEURL}/manage-group/${code}`,
    expiresAt,
    durationMs: 1000 * 60 * 60 * 12,
  }
}
