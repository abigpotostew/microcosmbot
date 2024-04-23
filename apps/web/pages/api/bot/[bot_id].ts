import { bot } from '@microcosms/bot'
import { webhookCallback } from 'grammy'
import { commands } from '@microcosms/bot'
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  runtime: 'edge',
}

function runMiddleware(req: NextRequest, res: NextResponse, fn: any) {
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
const callback = webhookCallback(bot, 'std/http')
const handler = async (req: NextRequest, res: NextResponse) => {
  try {
    const botId = req.nextUrl.searchParams.get('bot_id')
    if (botId !== process.env.TELEGRAM_BOT_KEY) {
      return NextResponse.json({ message: 'not found' }, { status: 404 })
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('ding ding')
    }
    await runMiddleware(req, res, callback)
    // return botWebhook(req, res)
  } catch (e) {
    console.error('failed to run', e)
    return NextResponse.json({ message: 'error' }, { status: 500 })
  }
}
export default handler
