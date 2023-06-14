import { Context, Middleware } from 'grammy'
import { MyContext } from '../../bot'

const chat_member: Middleware<MyContext> = async (
  ctx: MyContext
): Promise<void> => {
  // console.log('chat_member', ctx)
  ctx
}

export default chat_member
