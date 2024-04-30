import { bot, commands } from '@microcosms/bot'
import { webhookCallback } from 'grammy'
import { NextRequest, NextResponse } from 'next/server'
import { FrameworkAdapter } from 'grammy/out/convenience/frameworks'

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
const ok = () => new NextResponse(null, { status: 200 })
const okJson = (json: string) => NextResponse.json(json, { status: 200 })
const unauthorized = () =>
  NextResponse.json({ message: 'unauthorized' }, { status: 401 })

const callbackMine: FrameworkAdapter = (req: Request) => {
  let resolveResponse: (res: Response) => void
  return {
    update: req.json(),
    header: req.headers.get('X-Telegram-Bot-Api-Secret-Token') || undefined,
    end: () => {
      console.log('ok')
      if (resolveResponse) resolveResponse(ok())
    },
    respond: (json) => {
      console.log('respond:', json)
      if (resolveResponse) resolveResponse(okJson(json))
    },
    unauthorized: () => {
      console.log('unauthorized')
      if (resolveResponse) resolveResponse(unauthorized())
    },
    handlerReturn: new Promise((resolve) => {
      console.log('handlerReturn')
      resolveResponse = resolve
    }),
  }
}
const callback = webhookCallback(bot, 'std/http')

const handler = async (req: NextRequest, res: NextResponse) => {
  try {
    console.log('before bot_id')
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
