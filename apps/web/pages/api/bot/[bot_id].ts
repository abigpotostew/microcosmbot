import { bot, registerMenus } from '@microcosms/bot'
import { webhookCallback } from 'grammy'
import { NextApiRequest, NextApiResponse } from 'next'
import { commands } from '@microcosms/bot'

// The free version of vercel has restrictions on quotas, which we need to enable in the configuration file vercel.json
// webhookCallback will make sure that the correct middleware(listener) function is called

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

bot.use(commands)

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.query.bot_id !== process.env.TELEGRAM_BOT_KEY) {
    res.status(404).json({ ok: false })
  }
  console.log('ding ding')
  await runMiddleware(req, res, webhookCallback(bot, 'next-js'))
  // return botWebhook(req, res)
}
export default handler
