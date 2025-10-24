import { Middleware } from 'grammy'
import { logContext } from '../../utils/context'
import { MyContext } from '../../bot/context'
import { insertAudit } from '../../operations/audit/audit'
import {
  addMemberToGroup,
  removeMemberToGroup,
} from '../../operations/member/chat-member'

type MemberInOrOut = 'in' | 'out'
export const isMemberInGroup = (
  status:
    | 'creator'
    | 'administrator'
    | 'member'
    | 'restricted'
    | 'left'
    | 'kicked'
): MemberInOrOut => {
  const directionsIn = ['creator', 'administrator', 'member']
  const directionsOut = ['restricted', 'left', 'kicked']
  if (directionsIn.includes(status)) {
    return 'in'
  }
  if (directionsOut.includes(status)) {
    return 'out'
  }
  return 'out'
}
const on_chat_member: Middleware<MyContext> = async (
  ctx: MyContext
): Promise<void> => {
  const lc = logContext(ctx)
  const chatMember = ctx.chatMember
  if (!chatMember) {
    return
  }
  const date = new Date(chatMember.date * 1000)
  await insertAudit({
    auditType: 'CHAT_MEMBER',
    groupId: chatMember.chat.id.toString(),
    data: chatMember,
    updateDate: date,
    updateId: ctx.update.update_id.toString(),
  })

  const oldDirection = isMemberInGroup(chatMember.old_chat_member.status)
  const newDirection = isMemberInGroup(chatMember.new_chat_member.status)
  //they joined the group

  //added to the group
  if (oldDirection === 'out' && newDirection === 'in') {
    await addMemberToGroup({
      groupChatId: chatMember.chat.id,
      chatMember,
      lc,
    })
    return
  } else if (oldDirection === 'in' && newDirection === 'out') {
    await removeMemberToGroup({
      userId: chatMember.new_chat_member.user.id,
      groupChatId: chatMember.chat.id,
      lc,
    })
  }
}

export default on_chat_member
