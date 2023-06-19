import { z } from 'zod'
import { procedure, router } from '../trpc'
import { manageGroupRouter } from 'server/routers/manage-group'
import { verifyRouter } from 'server/routers/verify'
export const appRouter = router({
  manageGroup: manageGroupRouter,
  verify: verifyRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
