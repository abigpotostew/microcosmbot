import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { procedure, router } from 'server/trpc'
import { Group, ManageGroupCode, prismaClient } from '@microcosms/db'
import { zodStarsContractAddress } from 'libs/stars'
import bot from '@microcosms/bot/bot'
import { getChainInfo } from '@microcosms/bot/chains/ChainInfo'

const getOtp = procedure
  .input(z.object({ otp: z.string() }))

  .query(async ({ input, ctx }) => {
    if (input.otp === '00000000') {
      const chain = getChainInfo('stargaze-1')
      if (!chain) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      // this is a test code to verify the UI. It will always return the same group
      return {
        chain,
        adminsCount: 2,
        membersCount: 47,
        otp: input.otp,
        id: '0',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        consumed: false,

        group: {
          id: '0',
          name: 'Test',
          allowMatchAnyRule: false,
          groupTokenGate: [
            {
              id: '001',
              ruleType: 'SG721',
              name: 'hyperion',
              contractAddress: 'stars1234567890987654321',
              minTokens: 1,
              maxTokens: null,
              tokenFactoryDenom: null,
              tokenFactoryExponent: null,
            },
            {
              id: '002',
              ruleType: 'SG721',
              name: 'hyperion max',
              contractAddress: 'stars1234567890987654321',
              minTokens: 2,
              maxTokens: 3,
              tokenFactoryDenom: null,
              tokenFactoryExponent: null,
            },
            {
              id: '003',
              ruleType: 'DAO_DAO',
              name: 'hyperion DAO',
              contractAddress: 'stars1234567890987654321',
              minTokens: 1,
              maxTokens: 6,
              tokenFactoryDenom: null,
              tokenFactoryExponent: null,
            },
            {
              id: '004',
              ruleType: 'TOKEN_FACTORY',
              name: 'hyperion DAO',
              contractAddress: 'stars1234567890987654321',
              minTokens: 1,
              maxTokens: 6,
              tokenFactoryDenom: 'ustars',
              tokenFactoryExponent: 6,
            },
          ],
          createdAt: new Date('2023-07-02T08:00:00Z'),
        },
      }
    }
    if (!input.otp) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }

    //check code in db
    const info = await prismaClient().pendingGroupMember.findFirst({
      where: {
        code: input.otp,
        consumed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        code: true,
        expiresAt: true,
        consumed: true,
        group: {
          select: {
            id: true,
            groupId: true,
            chainId: true,
            name: true,
            createdAt: true,
            allowMatchAnyRule: true,
            groupTokenGate: {
              where: {
                active: true,
              },
              select: {
                id: true,
                name: true,
                contractAddress: true,
                minTokens: true,
                maxTokens: true,
                ruleType: true,
                tokenFactoryDenom: true,
                tokenFactoryExponent: true,
              },
            },
          },
        },
      },
    })
    if (info) {
      const chain = getChainInfo(info.group.chainId)
      if (!chain) {
        throw new TRPCError({ code: 'NOT_FOUND' })
      }
      const adminsCountPromise = prismaClient().groupAdmin.count({
        where: {
          groupId: info.group.id,
        },
      })
      const membersCountPromise = bot.api.getChatMemberCount(info.group.groupId)
      const [adminsCount, membersCount] = await Promise.all([
        adminsCountPromise,
        membersCountPromise,
      ])
      return {
        ...info,
        chain,
        adminsCount,
        membersCount,
      }
    }
    return null
  })

export const verifyRouter = router({
  // Public
  getOtp: getOtp,
})
