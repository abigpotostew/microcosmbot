import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { zodStarsAddress, zodStarsContractAddress } from 'libs/stars'
import { getOwnedCount } from '@microcosms/bot'

const schema = z.object({
  contractAddress: zodStarsContractAddress,
  owner: zodStarsAddress,
})
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(404).json({ message: 'not found' })
    return
  }

  const { contractAddress, owner } = req.query
  const parse = schema.safeParse({ contractAddress, owner })
  if (!parse.success) {
    res.status(400).json({ message: 'invalid parameters' })
    return
  }

  const count = await getOwnedCount(parse.data)
  //cache for 5 minutes
  res.setHeader('Cache-Control', 's-maxage=300')
  res.status(200).json({ count })
}
