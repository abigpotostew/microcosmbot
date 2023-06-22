import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { procedure, router } from 'server/trpc'
import { Group, ManageGroupCode, prismaClient } from '@microcosms/db'
import { zodStarsContractAddress } from 'libs/stars'

const getOtp = procedure
  .input(z.object({ otp: z.string() }))

  .query(async ({ input, ctx }) => {
    if (input.otp === '00000000') {
      return {
        otp: input.otp,
        id: '0',
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        consumed: false,
        group: {
          id: '0',
          name: 'Test',
          groupTokenGate: [],
        },
      }
    }
    if (!input.otp) {
      throw new TRPCError({ code: 'NOT_FOUND' })
    }
    //check code in db
    return prismaClient().pendingGroupMember.findFirst({
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
            name: true,
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
              },
            },
          },
        },
      },
    })
  })

export const verifyRouter = router({
  // Public
  getOtp: getOtp,
})
