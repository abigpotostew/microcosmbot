import Express, { Request, Response } from 'express'

export const createAppAndListen = () => {
  const app = Express()
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000

  app.get('/status', (req: Request, res: Response) => {
    res.status(200).json({ ok: true })
  })

  app.get(
    `/bot/${process.env.TELEGRAM_BOT_KEY}`,
    (req: Request, res: Response) => {
      res.status(200).json({ ok: true })
    }
  )

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}
