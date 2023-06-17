import { useCallback } from 'react'
import { trpc } from 'utils/trpc'
import { useRouter } from 'next/router'

export const useInvalidateCode = () => {
  const utils = trpc.useContext()
  const router = useRouter()
  const invalidateWork = useCallback(async () => {
    await utils.manageGroup.getGroup.invalidate()
    console.log('invalidated!')
    // if (router.query.code?.toString()) {
    //   console.log('refetching')
    //   await utils.manageGroup.getGroup.refetch({
    //     code: router.query.code.toString(),
    //   })
    // }
  }, [utils, router])

  return { invalidate: invalidateWork }
}
