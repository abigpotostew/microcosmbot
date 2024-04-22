import { z } from 'zod'
import { getOwnedCount } from '@microcosms/bot/operations/token-ownership/nft-ownership'
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  runtime: 'edge',
}

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
export default async function handler(req: NextRequest) {
  try {
    if (req.method !== 'GET') {
      return NextResponse.json({ message: 'not found' }, { status: 404 })
    }

    const url = new URL(req.url, 'https://example.com')
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

      return NextResponse.json(
        { message: 'invalid parameters', errors: parse.error.format() },
        { status: 400 }
      )
    }
    const chainIdOut = parse.data.chainId || 'stargaze-1'

    const count = await getOwnedCount({
      ...parse.data,
      chainId: chainIdOut,
      useRemoteCache: false,
    })

    //cache for 1 hour
    return NextResponse.json(
      { count },
      {
        status: 200,
        headers: {
          'Cache-Control': 's-maxage=3600',
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (e) {
    console.error('unexpected error', e)
    return NextResponse.json(
      { message: 'internal server error' },
      { status: 500 }
    )
  }
}
