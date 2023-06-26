import { prismaClient } from '@microcosms/db'
import { Middleware } from 'grammy'
import { ChatMemberAdministrator } from '@grammyjs/types/manage'
import { syncAdmins } from '../../operations/admin/sync-admins'
import { logContext } from '../../utils/context'
import { isMemberInGroup } from '../chat_member'
import { deactivateChatGroup } from '../../operations/group/deactivate-group'
import { MyContext } from '../../bot/context'
import { insertAudit } from '../../operations/audit'
import { saveActiveGroup } from '../../operations/group/save-active-group'

export const isBotHasManagePermissions = (admin: ChatMemberAdministrator) => {
  if (!admin.can_manage_chat) {
    return false
  }
  if (!admin.can_invite_users) {
    return false
  }
  if (!admin.can_restrict_members) {
    return false
  }

  return true
}

/**
 * Handles updates to the bot's chat member status for when it is added, removed from a group, or promoted/demoted.
 * @param ctx
 */
export const on_my_chat_member: Middleware<MyContext> = async (ctx) => {
  const cl = logContext(ctx, 'on_my_chat_member')
  cl.log('update Id', ctx.update.update_id)
  const myChatMember = ctx.myChatMember
  if (!myChatMember) {
    return //ignore
  }

  const date = new Date(ctx.myChatMember.date * 1000)

  await insertAudit({
    auditType: 'MY_CHAT_MEMBER',
    groupId: myChatMember.chat.id.toString(),
    data: myChatMember,
    updateDate: date,
    updateId: ctx.update.update_id.toString(),
  })

  const newDirection = isMemberInGroup(myChatMember.new_chat_member.status)
  const oldDirection = isMemberInGroup(myChatMember.old_chat_member.status)

  if (myChatMember.chat.type !== 'supergroup') {
    // not a supergroup, exit the group
    //if it's being added, show message and remove self
    if (newDirection === 'in') {
      await ctx.reply(
        `This group isn't configured for me yet. Set 'Chat history for new members' to 'Visible' and invite me again.`
      )
      await ctx.api.leaveChat(ctx.myChatMember.chat.id)
    }
    return
  }

  const groupChatId = ctx.myChatMember.chat.id.toString()

  if (newDirection === 'out') {
    cl.log('removed from group!')
    await deactivateChatGroup(groupChatId)
    return
  }

  if (myChatMember.new_chat_member.status !== 'administrator') {
    await deactivateChatGroup(groupChatId)
    await ctx.reply(
      'Please promote me to group administrator to token gate this group.'
    )
    return
  }

  if (!isBotHasManagePermissions(myChatMember.new_chat_member)) {
    await deactivateChatGroup(groupChatId)
    await ctx.reply(
      'I need invite and remove member permissions to manage this chat.'
    )
    return
  }

  // create or activate the group
  const group = await saveActiveGroup(
    {
      groupId: ctx.myChatMember.chat.id.toString(),
      title: myChatMember.chat.title,
    },
    cl
  )

  if (!group) {
    // the group already exists and is active
    return
  }

  await syncAdmins(ctx, ctx.myChatMember.chat.id, group)
  cl.log('admins synced')
  return ctx.reply('Group activated!')
}
