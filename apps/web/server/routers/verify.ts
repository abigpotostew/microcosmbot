import { z } from 'zod'
import { TRPCError } from '@trpc/server'
import { procedure, router } from 'server/trpc'
import { Group, ManageGroupCode, prismaClient } from '@microcosms/db'
import { zodStarsContractAddress } from 'libs/stars'

const getOtp = procedure
  .input(z.object({ otp: z.string() }))

  .query(async ({ input, ctx }) => {
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
      include: {
        group: {
          include: {
            groupTokenGate: true,
          },
        },
      },
    })
  })

export const verifyRouter = router({
  // Public
  getOtp: getOtp,
})
