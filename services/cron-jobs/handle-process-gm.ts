import {
    checkAccessRules,
    kickUser,
    LogContext
} from '@microcosmbot/bot'
import { prismaClient } from '@microcosmbot/db'

export const config = {
  api: {
    bodyParser: false,
  },
}

export const handleGroupMemberId = async (
  groupMemberId: string,
  cl: LogContext
) => {
  try {
    const groupWithMember = await prismaClient().group.findFirst({
      where: {
        groupMembers: {
          some: {
            active: true,
            id: groupMemberId,
          },
        },
      },
      include: {
        groupTokenGate: true,
        groupMembers: {
          where: {
            active: true,
            id: groupMemberId,
          },
          include: {
            account: {
              include: {
                wallets: true,
              },
            },
          },
        },
      },
    })
    if (!groupWithMember?.groupMembers?.length) {
      cl.log("couldn't find the group member", groupMemberId)
      return {
        ok: true,
      }
    }

    // it should only be 1 wallet
    const wallets = groupWithMember.groupMembers
      .map((gm) => gm.account.wallets)
      .flat()
    const allowedWallet = await checkAccessRules(cl, groupWithMember, wallets, {
      useRemoteCache: true,
    })
    if (!allowedWallet) {
      //kick them from the group. deactivate in db.
      cl.log('kicking member', groupMemberId, 'from group', groupWithMember.id)
      await kickUser(groupWithMember, groupWithMember.groupMembers[0])
    }
    cl.log(
      'done processing group member',
      groupMemberId,
      'allowed?',
      !!allowedWallet
    )
    return {
      ok: true,
    }
  } catch (e) {
    cl.error('something went wrong. retrying', e)
    return {
      ok: false,
      error: 'something went wrong.',
    }
  }
}
