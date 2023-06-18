import { MyContext } from '../bot'

export interface LogContext {
  log: (...args: any[]) => void
  error: (...args: any[]) => void
}
export const logContext = (ctx: MyContext | string): LogContext => {
  const updateId = typeof ctx === 'string' ? ctx : ctx.update.update_id
  return {
    log: (...args: any[]) => {
      console.log(`${updateId}`, ...args)
    },
    error: (...args: any[]) => {
      console.error(`${updateId}`, ...args)
    },
  }
}
