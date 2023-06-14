import { Middleware } from 'grammy'
import { MyContext } from '../../bot'

export const my_chat_member: Middleware<MyContext> = async (ctx) => {
  ctx.myChatMember
  //new_chat_member old member
  //old_chat_member new member
}
