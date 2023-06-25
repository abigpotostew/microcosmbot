import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { zodStarsAddress, zodStarsContractAddress } from 'libs/stars'
import { getOwnedCount } from '@microcosms/bot'

const schema = z.object({
  contractAddress: zodStarsContractAddress,
  owner: zodStarsAddress,
})
/**
 * API endpoint to get the number of NFTs owned by an address and cache it in vercel so that during
 * batch processing, we don't have to hit the blockchain for each account for every NFT collection.
 * @param req
 * @param res
 */
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
