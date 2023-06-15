import { NextApiRequest, NextApiResponse } from 'next'
import { bot } from '@microcosms/bot'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.query.bot_id !== process.env.TELEGRAM_BOT_KEY) {
    res.status(404).json({ ok: false })
  }

  await bot.api.deleteWebhook()
  await bot.api.setWebhook(process.env['WEBHOOK'] || '', {
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
  })

  await bot.api.setMyCommands([
    { command: 'start', description: 'Start the bot' },
    { command: 'help', description: 'Show help text' },
    { command: 'settings', description: 'Open settings' },
    { command: 'verify', description: 'Open settings' },
    { command: 'echo', description: 'echo input ' },
  ])
  console.log('bot configured')

  res.status(200).json({ ok: true })
}

export default handler
