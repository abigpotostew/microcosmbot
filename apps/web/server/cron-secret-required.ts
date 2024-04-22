import { NextApiRequest, NextApiResponse } from 'next'

export const cronSecretRequired = (
  req: NextApiRequest
):
  | {
      ok: false | null | undefined | ''
      setResponse: (res: NextApiResponse) => void
    }
  | { ok: true; setResponse: undefined } => {
  const authHeader = req.headers?.['authorization']
  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return {
      ok: false,
      setResponse: (res: NextApiResponse) =>
        res.status(401).json({ success: false }),
    }
  }
  return { ok: true, setResponse: undefined }
}
