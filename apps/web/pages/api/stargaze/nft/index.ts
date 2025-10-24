import { z } from 'zod'
import { getOwnedCount } from '@microcosms/bot'
import type { NextApiRequest, NextApiResponse } from 'next'

const schema = z.object({
  //since it's an internal api, don't bother checking for the contract address
  contractAddress: z.string().nullish(),
  //since it's an internal api, don't bother checking for the address
  owner: z.string(),
  ruleType: z.enum(['DAO_DAO', 'SG721', 'TOKEN_FACTORY']),
  denom: z.string().nullish(),
  exponent: z
    .string()
    .refine((v) => {
      const n = parseInt(v)
      return n >= 0 && n <= 255
    })
    .transform((v) => {
      return parseInt(v)
    })
    .nullish(),
  chainId: z.string().nullish(),
})

/**
 * API endpoint to get the owned token count by an address and cache it in vercel so that during
 * batch processing, we don't have to hit the blockchain for each account for every rule check.
 * @param req
 * @param res
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== 'GET') {
      return res.status(404).json({ message: 'not found' })
    }

    const url = new URL(req.url ?? '/', 'https://example.com')
    const query = url.searchParams
    const parse = schema.safeParse({
      contractAddress: query.get('contractAddress'),
      owner: query.get('owner'),
      ruleType: query.get('ruleType'),
      denom: query.get('denom'),
      exponent: query.get('exponent'),
      chainId: query.get('chainId'),
    })
    if (!parse.success) {
      console.log('invalid parameters', parse.error.format())

      return res.status(400).json(
        { message: 'invalid parameters', errors: parse.error.format() },
      )
    }
    const chainIdOut = parse.data.chainId || 'stargaze-1'

    const count = await getOwnedCount({
      ...parse.data,
      chainId: chainIdOut,
      useRemoteCache: false,
    })

    // 'Cache-Control': 's-maxage=3600',
    //cache for 1 hour
    res.setHeader('Cache-Control', 's-maxage=3600')
    return res.status(200).json(
      { count }
    )
  } catch (e) {
        console.error('unexpected error', e)
        return res.status(500).json(
      { message: 'internal server error' }
    )
  }
}
