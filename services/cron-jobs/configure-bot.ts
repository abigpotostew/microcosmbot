import { bot } from '../../bot/bot'

/**
 * Configure the bot webhook and commands
 */
export async function configureBot(): Promise<void> {
  try {
    console.log('[CRON JOB] Starting bot configuration')
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
    console.log('[CRON JOB] Bot configured successfully:', webhookUrl)
  } catch (e) {
    console.error('[CRON JOB] Error configuring bot:', e)
  }
}

