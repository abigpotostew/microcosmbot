import { bot } from '@microcosms/bot'
import { NextRequest, NextResponse } from 'next/server'

export const config = {
  runtime: 'edge',
}
/**
 * API endpoint to configure the bot. This should be called once by the bot owner whenever the BASEURL or
 * any webhook config or commands change.
 * @param req
 * @param res
 */
const handler = async (req: NextRequest, res: NextResponse) => {
  const botId = req.nextUrl.searchParams.get('bot_id')

  if (botId !== process.env.TELEGRAM_BOT_KEY) {
    return NextResponse.json({ message: 'not found' }, { status: 404 })
  }

  const webhookUrl = process.env.BASEURL + '/api/bot'

  await bot.api.deleteWebhook()
  await bot.api.setWebhook(webhookUrl, {
    allowed_updates: [
      'my_chat_member',
      'chat_member',
      'message',
      'chosen_inline_result',
      'inline_query',
      'channel_post',
      'edited_channel_post',
      'edited_message',
      'callback_query',
    ],
    secret_token: process.env.TG_WEBHOOK_SECRET,
  })

  await bot.api.setMyCommands([
    { command: 'start', description: 'Start verification to join a group' },
    { command: 'help', description: 'Show help text' },
    { command: 'invite', description: "Get your group's invite link" },
    { command: 'me', description: 'Show registered accounts' },
    { command: 'settings', description: 'Configure your group' },
    { command: 'sync', description: 'Sync group admins' },
  ])
  console.log('bot configured', webhookUrl)

  return NextResponse.json(
    { ok: true, baseUrl: process.env.BASEURL },
    { status: 200 }
  )
}

export default handler
