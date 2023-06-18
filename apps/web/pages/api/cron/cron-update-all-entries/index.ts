import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  //todo enqueue
  res.status(200).end('Hello Cron!')
}
