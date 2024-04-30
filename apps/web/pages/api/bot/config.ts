import { NextApiRequest, NextApiResponse } from 'next'
import { bot } from '@microcosms/bot'
import { cronSecretRequired } from 'server/cron-secret-required'

/**
 * API endpoint to configure the bot. This should be called once by the bot owner whenever the BASEURL or
 * any webhook config or commands change.
 * @param req
 * @param res
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const authorized = cronSecretRequired(req)
  if (!authorized.ok) {
    return authorized.setResponse(res)
  }

  const webhookUrl = process.env.BASEURL + '/api/bot'

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

  res.status(200).json({ ok: true })
}

export default handler
