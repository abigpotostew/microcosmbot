import { UserFromGetMe } from '@grammyjs/types/manage'
import { z } from 'zod'

const getBotInfoFromEnv = (): UserFromGetMe => {
  const info = JSON.stringify(process.env.GETME_BOT_INFO || '{}')
  const infoParsed = z
    .object({
      id: z.number(),
      is_bot: z.boolean(),
      first_name: z.string(),
      username: z.string(),
      can_join_groups: z.boolean(),
      can_read_all_group_messages: z.boolean(),
      supports_inline_queries: z.boolean(),
    })
    .safeParse(info)
  if (!infoParsed.success) {
    console.warn('GETME_BOT_INFO is not valid getMe JSON format')
    return {
      id: 1,
      is_bot: true,
      first_name: 'MissingConfig-GETME_BOT_INFO',
      username: 'MissingConfig-GETME_BOT_INFO',
      can_join_groups: true,
      can_read_all_group_messages: true,
      supports_inline_queries: false,
    }
  }
  if (!infoParsed.data.is_bot) {
    console.log('bot info is not a bot')
    return {
      id: 1,
      is_bot: true,
      first_name: 'MissingConfig-GETME_BOT_INFO',
      username: 'MissingConfig-GETME_BOT_INFO',
      can_join_groups: true,
      can_read_all_group_messages: true,
      supports_inline_queries: false,
    }
  }
  if (!infoParsed.data.is_bot) {
    console.log('bot info is not a bot')
    return {
      id: 0,
      is_bot: true,
      first_name: 'MissingConfig-GETME_BOT_INFO',
      username: 'MissingConfig-GETME_BOT_INFO',
      can_join_groups: true,
      can_read_all_group_messages: true,
      supports_inline_queries: false,
    }
  }
  return { ...infoParsed.data, is_bot: true }
}

export const botInfo: UserFromGetMe = getBotInfoFromEnv()
