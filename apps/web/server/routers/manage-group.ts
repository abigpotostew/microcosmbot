import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { procedure, router } from 'server/trpc'
import { Group, ManageGroupCode, prismaClient } from '@microcosms/db'
import { zodStarsContractAddress } from 'libs/stars'
import bot from '@microcosms/bot/bot'

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
    const adminsCountPromise = prismaClient().groupAdmin.count({
      where: {
        groupId: codeDb.group.id,
      },
    })
    const membersCountPromise = bot.api.getChatMemberCount(codeDb.group.groupId)
    const [adminsCount, membersCount] = await Promise.all([
      adminsCountPromise,
      membersCountPromise,
    ])
    return { ...codeDb, adminsCount, membersCount }
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
      id: z.string().cuid().optional(),
      code: z.string(),
      updates: z.object({
        name: z.string().max(128),
        minToken: z.number().int().nonnegative().nullish(),
        maxToken: z.number().int().nonnegative().nullish(),
        contractAddress: zodStarsContractAddress,
        ruleType: z.enum(['SG721', 'DAO_DAO']).default('SG721'),
      }),
    })
  )

  .mutation(async ({ input, ctx }) => {
    if (!input.code) {
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
    const count = await prismaClient().groupTokenGate.count({
      where: {
        group: {
          id: codeDb.group.id,
        },
      },
    })
    if (count >= 15) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Max 15 rules per group',
      })
    }
    if (!input.id) {
      return prismaClient().groupTokenGate.create({
        data: {
          name: input.updates.name,
          minTokens: input.updates.minToken || 1,
          maxTokens: input.updates.maxToken,
          contractAddress: input.updates.contractAddress,
          group: {
            connect: {
              id: codeDb.group.id,
            },
          },
          ruleType: input.updates.ruleType,
        },
      })
    }

    return prismaClient().groupTokenGate.update({
      where: {
        id: input.id,
      },
      data: {
        name: input.updates.name,
        minTokens: input.updates.minToken || 1,
        maxTokens: input.updates.maxToken,
        contractAddress: input.updates.contractAddress,
        //cannot change the rule type
      },
    })
  })

const deleteRule = procedure
  .input(
    z.object({
      id: z.string().cuid(),
      code: z.string(),
    })
  )

  .mutation(async ({ input, ctx }) => {
    if (!input.code) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }
    //check code in db
    const deletedRes = await prismaClient().groupTokenGate.deleteMany({
      where: {
        id: input.id,
        group: {
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
    })
    if (!deletedRes.count) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }
  })

const setMatchAny = procedure
  .input(
    z.object({
      matchAny: z.boolean(),
      code: z.string(),
    })
  )

  .mutation(async ({ input, ctx }) => {
    if (!input.code) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }
    const updatedRes = await prismaClient().group.updateMany({
      where: {
        manageGroupCodes: {
          some: {
            code: input.code,
            expiresAt: {
              gt: new Date(),
            },
          },
        },
      },
      data: {
        allowMatchAnyRule: input.matchAny,
      },
    })
    if (!updatedRes.count) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }
    return true
  })

export const manageGroupRouter = router({
  // Public
  getGroup: getGroup,
  getRule: getRule,
  saveRule: saveRule,
  deleteRule: deleteRule,
  setMatchAny: setMatchAny,
})
