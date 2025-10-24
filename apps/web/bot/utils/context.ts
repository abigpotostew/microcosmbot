import { MyContext } from '../bot/context'

export interface LogContext {
  log: (...args: any[]) => void
  error: (...args: any[]) => void
}

export const logContext = (
  ctx: MyContext | string,
  tag?: string
): LogContext => {
  const updateId =
    (tag ? `${tag}:` : '') +
    (typeof ctx === 'string' ? ctx : ctx.update.update_id)
  return {
    log: (...args: any[]) => {
      console.log(`${updateId}`, ...args)
    },
    error: (...args: any[]) => {
      console.error(`${updateId}`, ...args)
    },
  }
}
