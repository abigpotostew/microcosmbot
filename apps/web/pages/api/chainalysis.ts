import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await fetch(
      `https://public.chainalysis.com/api/v1/address/${req.headers.address}`,
      {
        headers: {
          'X-API-Key': `${process.env.NEXT_PUBLIC_CHAINALYSIS_API_KEY}`,
          Accept: 'application/json',
        },
      }
    )
    const data = await result.json()

    res.status(200).json(data)
  } catch (error) {
    res.status(400).send(error)
  }
}
