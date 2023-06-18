import { prismaClient } from '@microcosms/db'
import { NextApiRequest, NextApiResponse } from 'next'
import { publishMessage } from '../../../../services/qstash'
import { tinyAsyncPoolAll } from '@microcosms/bot'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const take = 500
    for (let i = 0; i < 10000; i++) {
      const page = await prismaClient().groupMember.findMany({
        where: {
          active: true,
          group: {
            active: true,
          },
        },
        select: {
          id: true,
        },
        take,
        skip: i * take,
      })
      await tinyAsyncPoolAll(
        page,
        async (gm) => {
          await publishMessage({
            data: {},
            retries: 3, //max for free tier
            url: `${process.env.BASEURL}/api/cron/process/${gm.id}`,
          })
        },
        { concurrency: 20 }
      )
      if (page.length < take) {
        break
      }
    }
  } catch (e) {
    console.error(e)
  }
  res.status(200).end('Hello Cron!')
}
