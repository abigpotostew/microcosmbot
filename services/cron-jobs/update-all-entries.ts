import { prismaClient } from 'prisma'
import { tinyAsyncPoolAll } from '@microcosms/bot'
import { logContext } from '@microcosms/bot'
import { handleGroupMemberId } from './handle-process-gm'


/** Check access rules against all group members. It runs in memory. */
export async function updateAllEntriesDirect(): Promise<void> {
  try {
    console.log('[CRON JOB] Starting update-all-entries')
    const take = 500
    for (let i = 0; i < 10000; i++) {
      const page = await prismaClient().groupMember.findMany({
        where: {
          active: true,
          group: {
            active: true,
          },
        },
        select: {
          id: true,
        },
        take,
        skip: i * take,
      })
      await tinyAsyncPoolAll(
        page,
        async (gm) => {
          let success=false;
          for (let i = 0; i < 10; i++) {
            try {
              const { ok } = await handleGroupMemberId(gm.id, logContext(gm.id))
              if (ok) {
                success=true;
                break
              }
            } catch (e) {
              console.error(
                `[CRON JOB] Error in update-all-entries ${gm.id}:`,
                e
              )
            }
            await new Promise((resolve) => setTimeout(resolve, 1000))
          }
          if (!success) {
            console.error('[CRON JOB] Failed to update group member:', gm.id)
          }
        },
        { concurrency: 20 }
      )
      if (page.length < take) {
        break
      }
    }
    console.log('[CRON JOB] Completed update-all-entries')
  } catch (e) {
    console.error('[CRON JOB] Error in update-all-entries:', e)
  }
}
