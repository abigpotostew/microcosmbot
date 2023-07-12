import { useRouter } from 'next/router'
import { trpc } from 'utils/trpc'

export const useOtp = () => {
  const router = useRouter()

  return trpc.verify.getOtp.useQuery(
    { otp: router.query.otp?.toString() as string },
    {
      enabled: !!router.query.otp?.toString(),
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )
}
