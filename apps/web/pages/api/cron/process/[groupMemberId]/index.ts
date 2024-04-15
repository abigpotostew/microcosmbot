import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { prismaClient } from '@microcosms/db'
import {
  kickUser,
  checkAccessRules,
  LogContext,
  logContext,
} from '@microcosms/bot'
import { Receiver } from '@upstash/qstash'

export const config = {
  api: {
    bodyParser: false,
  },
}

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

  try {
    const c = new Receiver({
      currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY ?? '',
      nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY ?? '',
    })
    const readable = req.read()
    const buffer = Buffer.from(readable)
    const rawBody = buffer.toString()
    const isValid = await c
      .verify({
        signature: (
          req.headers['upstash-signature'] ??
          req.headers['Upstash-Signature'] ??
          ''
        ).toString(),
        body: rawBody,
      })
      .catch((err) => {
        console.error('error validating upstash signature', err)
        return false
      })
    if (!isValid) {
      return new Response('Invalid signature', { status: 401 })
    }

    if (req.headers['content-type'] !== 'application/json') {
      return new Response('Invalid content type', { status: 400 })
    }
    const data = JSON.parse(rawBody)

    let cl: LogContext
    if (req.url) {
      cl = logContext(req.url)
    } else {
      cl = logContext('unknown request path:')
    }

    try {
      const parse = schema.safeParse(data)
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
  } catch (e) {
    console.error('unexpected error', e)
    return res.status(500).json({ message: 'internal server error' })
  }
}
