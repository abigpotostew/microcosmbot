import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { procedure, router } from 'server/trpc'
import { Group, ManageGroupCode, prismaClient } from '@microcosms/db'
import { zodStarsContractAddress } from 'libs/stars'
import bot from '@microcosms/bot/bot'

const getOtp = procedure
  .input(z.object({ otp: z.string() }))

  .query(async ({ input, ctx }) => {
    if (input.otp === '00000000') {
      // this is a test code to verify the UI. It will always return the same group
      return {
        adminsCount: 2,
        membersCount: 47,
        otp: input.otp,
        id: '0',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        consumed: false,
        group: {
          id: '0',
          name: 'Test',

          groupTokenGate: [
            {
              id: '001',
              name: 'hyperion',
              contractAddress: 'stars1234567890987654321',
              minTokens: 1,
              maxTokens: null,
              ruleType: 'SG721',
            },
            {
              id: '002',
              name: 'hyperion max',
              contractAddress: 'stars1234567890987654321',
              minTokens: 2,
              maxTokens: 3,
              ruleType: 'DAO_DAO',
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
            name: true,
            createdAt: true,
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
              },
            },
          },
        },
      },
    })
    if (info) {
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
