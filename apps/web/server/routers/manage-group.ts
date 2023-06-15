import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { procedure, router } from 'server/trpc'
import { prismaClient } from '@microcosms/db'

const getGroup = procedure
  .input(z.object({ code: z.string() }))

  .query(async ({ input, ctx }) => {
    if (!input.code) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }
    //check code in db

    const codeDb = await prismaClient().manageGroupCode.findFirst({
      where: {
        code: input.code,
      },
      include: {
        group: true,
      },
    })
    if (!codeDb) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }
    return codeDb.group
  })

const editUser = procedure
  .input(z.object({ address: z.string().optional() }))

  .mutation(async ({ input, ctx }) => {})

export const manageGroupRouter = router({
  // Public
  getGroup,
})
