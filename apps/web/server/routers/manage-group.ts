import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { procedure, router } from 'server/trpc'
import { Group, ManageGroupCode, prismaClient } from '@microcosms/db'
import { zodStarsContractAddress } from 'libs/stars'

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
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        group: {
          include: {
            groupTokenGate: {
              where: {
                active: true,
              },
            },
          },
        },
      },
    })
    if (!codeDb) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }
    return codeDb
  })

const getRule = procedure
  .input(z.object({ id: z.string().cuid(), code: z.string() }))

  .query(async ({ input, ctx }) => {
    if (!input.code || !input.id) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }
    //check code in db

    const codeDb = await prismaClient().manageGroupCode.findFirst({
      where: {
        code: input.code,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        group: {
          include: {
            groupTokenGate: {
              where: {
                active: true,
                id: input.id,
              },
            },
          },
        },
      },
    })
    if (!codeDb) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }
    return codeDb
  })

const saveRule = procedure
  .input(
    z.object({
      id: z.string().cuid(),
      code: z.string(),
      updates: z.object({
        name: z.string().max(128),
        minToken: z.number().int().nonnegative().nullish(),
        maxToken: z.number().int().nonnegative().nullish(),
        contractAddress: zodStarsContractAddress,
      }),
    })
  )

  .mutation(async ({ input, ctx }) => {
    if (!input.code || !input.id) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }
    //check code in db
    if (
      input.updates.maxToken &&
      input.updates.minToken &&
      input.updates.maxToken < input.updates.minToken
    ) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'maxToken must be greater than minToken',
      })
    }

    const updated = await prismaClient().groupTokenGate.updateMany({
      where: {
        id: input.id,
        group: {
          active: true,
          manageGroupCodes: {
            some: {
              code: input.code,
              expiresAt: {
                gt: new Date(),
              },
            },
          },
        },
      },
      data: {
        ...input.updates,
      },
    })

    const codeDb = await prismaClient().manageGroupCode.findFirst({
      where: {
        code: input.code,
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        group: {
          include: {
            groupTokenGate: {
              where: {
                active: true,
                id: input.id,
              },
            },
          },
        },
      },
    })
    if (!codeDb) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }
    return codeDb
  })

export const manageGroupRouter = router({
  // Public
  getGroup: getGroup,
  getRule: getRule,
  saveRule: saveRule,
})
