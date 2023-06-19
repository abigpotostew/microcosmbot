import { prismaClient } from '@microcosms/db'
import { Middleware } from 'grammy'
import { MyContext } from '../../bot'
import { ChatMemberAdministrator } from '@grammyjs/types/manage'
import { syncAdmins } from '../../operations/sync-admins'
import { logContext } from '../../utils/context'
import { membershipInGroup } from '../chat_member'
import { deactivateChatGroup } from '../../operations/deactivate-group'

export const checkHasPermissions = (admin: ChatMemberAdministrator) => {
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
export const my_chat_member: Middleware<MyContext> = async (ctx) => {
  const cl = logContext(ctx, 'my_chat_member')
  cl.log('update Id', ctx.update.update_id)
  const myChatMember = ctx.myChatMember
  if (!myChatMember) {
    return //ignore
  }

  const date = new Date(ctx.myChatMember.date * 1000)
  await prismaClient().auditLog.create({
    data: {
      auditType: 'MY_CHAT_MEMBER',
      groupId: myChatMember.chat.id,
      data: JSON.parse(JSON.stringify(myChatMember)),
      updateDate: date,
      updateId: ctx.update.update_id,
    },
  })

  const newDirection = membershipInGroup(myChatMember.new_chat_member.status)
  const oldDirection = membershipInGroup(myChatMember.old_chat_member.status)

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

  //todo check if permissions have been demoted from admin to member

  // if (myChatMember.chat.type !== 'supergroup') {
  //   // not a supergroup, exit the group
  //   await ctx.reply('This bot only works in supergroups. Exiting group.')
  //   await ctx.api.leaveChat(ctx.myChatMember.chat.id)
  // }
  const groupChatId = ctx.myChatMember.chat.id.toString()

  //todo remove from db admin
  if (newDirection === 'out') {
    //todo deactivate the group

    //remove it from db?
    //todo remove any admins or members...
    cl.log('removed from group!')
    await deactivateChatGroup(groupChatId)
    return
  }

  if (myChatMember.new_chat_member.status !== 'administrator') {
    //todo deactivate the group
    await deactivateChatGroup(groupChatId)
    await ctx.reply(
      'Please promote me to group administrator to token gate this group.'
    )
    return
  }

  if (!checkHasPermissions(myChatMember.new_chat_member)) {
    await deactivateChatGroup(groupChatId)
    await ctx.reply(
      'I need invite and remove member permissions to manage this chat.'
    )
    return
  }

  // const admins = await ctx.getChatAdministrators()
  // const isAdmin = admins.filter((a) => a.user.id === myChatMember.from.id)
  // if (!isAdmin) {
  //   //invited by non admin
  //   //we cannot associate the group creator
  // }
  //create or activate the group
  const existingGroup = await prismaClient().group.findFirst({
    where: {
      groupId: ctx.myChatMember.chat.id.toString(),
    },
    select: {
      id: true,
      groupId: true,
      active: true,
    },
  })
  if (existingGroup?.active) {
    cl.log(
      `Group ${existingGroup.id}:${existingGroup.groupId} is already active in the db`
    )
    return
  }
  const group = await prismaClient().group.upsert({
    where: {
      groupId: ctx.myChatMember.chat.id.toString(),
    },
    create: {
      name: myChatMember.chat.title,
      groupId: ctx.myChatMember.chat.id.toString(),
      active: true,
    },
    update: {
      name: myChatMember.chat.title,
      active: true,
    },
  })
  await syncAdmins(ctx, ctx.myChatMember.chat.id, group)
  cl.log('admins synced')
  return ctx.reply('Group activated!')
  //new_chat_member old member
  //old_chat_member new member
}
