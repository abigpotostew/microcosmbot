import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { prismaClient } from '@microcosms/db'
import {
  kickUser,
  checkAccessRules,
  LogContext,
  logContext,
} from '@microcosms/bot'

const schema = z.object({
  groupMemberId: z.string().cuid(),
})
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(404).json({ message: 'not found' })
    return
  }
  let cl: LogContext
  if (req.url) {
    cl = logContext(req.url)
  } else {
    cl = logContext('unknown request path:')
  }

  try {
    const { groupMemberId } = req.query
    const parse = schema.safeParse({ groupMemberId })
    if (!parse.success) {
      res.status(400).json({ message: 'invalid parameters' })
      return
    }

    const groupWithMember = await prismaClient().group.findFirst({
      where: {
        groupMembers: {
          some: {
            active: true,
            id: parse.data.groupMemberId,
          },
        },
      },
      include: {
        groupTokenGate: true,
        groupMembers: {
          where: {
            active: true,
            id: parse.data.groupMemberId,
          },
          include: {
            account: {
              include: {
                wallets: true,
              },
            },
          },
        },
      },
    })
    if (!groupWithMember?.groupMembers?.length) {
      return res
        .status(200)
        .json({ message: 'could not find the group member. stopping' })
    }

    // it should only be 1 wallet
    const wallets = groupWithMember.groupMembers
      .map((gm) => gm.account.wallets)
      .flat()
    const allowed = await checkAccessRules(cl, groupWithMember, wallets, {
      useRemoteCache: true,
    })
    if (!allowed) {
      //kick them from the group. deactivate in db.
      cl.log(
        'kicking member',
        parse.data.groupMemberId,
        'from group',
        groupWithMember.id
      )
      await kickUser(groupWithMember, groupWithMember.groupMembers[0])
    }
    return res.status(200).json({ message: 'done' })
  } catch (e) {
    cl.error('something went wrong. retrying')
    return res.status(500).json({ message: 'something went wrong.' })
  }
}
