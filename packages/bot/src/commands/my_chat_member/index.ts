import { prismaClient } from '@microcosms/db'
import { Middleware } from 'grammy'
import { MyContext } from '../../bot'
import { ChatMemberAdministrator } from '@grammyjs/types/manage'
import { syncAdmins } from '../../operations/sync-admins'

const checkHasPermissions = (admin: ChatMemberAdministrator) => {
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
  const myChatMember = ctx.myChatMember
  if (!myChatMember) {
    return //ignore
  }
  if (myChatMember.chat.type !== 'supergroup') {
    // not a supergroup, exit the group
    return
  }
  console.log('update Id', ctx.update.update_id)
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

  // if (myChatMember.chat.type !== 'supergroup') {
  //   // not a supergroup, exit the group
  //   await ctx.reply('This bot only works in supergroups. Exiting group.')
  //   await ctx.api.leaveChat(ctx.myChatMember.chat.id)
  // }
  if (
    myChatMember.new_chat_member.status === 'left' ||
    myChatMember.new_chat_member.status === 'kicked'
  ) {
    //remove it from db?
    console.log('removed from group!')
    return
  }
  if (myChatMember.new_chat_member.status !== 'administrator') {
    await ctx.reply('Please promote me to group administrator.')
    return
  }
  if (!checkHasPermissions(myChatMember.new_chat_member)) {
    await ctx.reply('Please give me the correct permissions.')
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
  })
  if (existingGroup?.active) {
    console.log(
      `group ${existingGroup.id}:${existingGroup.groupId} is already active in the db`
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
  return ctx.reply('Group activated!')
  //new_chat_member old member
  //old_chat_member new member
}
