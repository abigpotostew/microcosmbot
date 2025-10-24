import { Group, prismaClient } from '@microcosms/db'
import { toHex } from '../../utils/hex'

export const generateAdminLink = async (group: Group) => {
  const code = toHex(crypto.getRandomValues(new Uint8Array(16)))
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
