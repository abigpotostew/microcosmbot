import { z } from 'zod'
import { procedure, router } from '../trpc'
import { manageGroupRouter } from 'server/routers/manage-group'
export const appRouter = router({
  manageGroup: manageGroupRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
