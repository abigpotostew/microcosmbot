import { useRouter } from 'next/router'
import { websiteData } from 'constants/websiteData'
import { PrimaryButton } from '@microcosmbot/ui'
import { useMutation } from '@tanstack/react-query'
import { useChain } from '@cosmos-kit/react'
import { signLoginMessageWithAmino } from 'libs/verify/keplr'
import { useCallback, useState } from 'react'
import { trpc } from 'utils/trpc'
import { SpinningCircles } from 'react-loading-icons'
import { config } from '@microcosms/bot/config'
import useWallet from '../../client/react/wallet/useWallet'
import { ac } from 'vitest/dist/types-0373403c'

//todo client side render to grab the OTP, and group.
const VerifyView: React.FC = () => {
  const router = useRouter()

  const otpRes = trpc.verify.getOtp.useQuery(
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

  // const {
  //   connect,
  //   disconnect,
  //   status,
  //   address,
  //   signAmino,
  //   getAccount,
  // } = useChain(config.chainName)

  const { connect, disconnect, wallet, signAmino, getAccount, status } =
    useWallet()
  // const address = wallet?.address

  const [sig, setSig] = useState<string | null>(null)

  const loginMutation = useMutation(async () => {
    const otp = router.query.otp?.toString()
    if (!otp) {
      throw new Error('no otp')
    }
    const account = await getAccount()
    if (!account) {
      throw new Error('no account')
    }
    const address = account.address
    if (!address) {
      throw new Error('no address connected')
    }
    if (!signAmino) {
      throw new Error('no signAmino')
    }

    const overwrite = !!sig
    let inputSig = sig
    if (!inputSig) {
      // const account = wallet
      const res1 = await signLoginMessageWithAmino(otp, address, signAmino)

      console.log('res', res1)
      inputSig =
        sig || JSON.stringify({ ...res1.signature, otp, account: account })
      setSig(inputSig)
    }
    const res = await fetch(
      `/api/verify${overwrite ? '?overwrite=true' : ''}`,
      {
        method: 'POST',
        body: inputSig,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    if (!res.ok) {
      const body = await res.json()
      throw new Error('Failed to verify: ' + body.message)
    }
    const body = await res.json()
    console.log(`It's SUCCESS body`, body)
    const dup = body.message === 'duplicate wallet'
    if (dup) {
      return { duplicate: dup }
    } else {
      return {
        allowed: body.message !== 'not passing rules',
        link: body.link as string,
      }
    }
  })

  const disconnectWallet = useCallback(() => {
    disconnect()
    setSig(null)
    loginMutation.reset()
  }, [setSig, loginMutation, disconnect])

  const DisconnectedButton = () => {
    return (
      <PrimaryButton
        disabled={loginMutation.isLoading}
        classes="w-full lg:w-50 bg-gray-400"
        onClick={disconnectWallet}
      >
        Disconnect
      </PrimaryButton>
    )
  }
  return (
    <>
      <header className="relative z-50 bg-olive-200 pt-16 pb-8 lg:pb-9">
        <div className="container flex flex-col px-6 gap-8 lg:gap-0 lg:items-center lg:flex-row">
          <div className="flex flex-col gap-4 flex-grow flex-shrink-0">
            <h1 className="text-title2">{websiteData.verifySection.title}</h1>
            <p className="text-body4 text-olive-600">
              {websiteData.verifySection.subtitle}
            </p>
          </div>
          {/*  <div className="flex items-center justify-between mb-4 sm:justify-start lg:mb-0">*/}
          {/*      {Object.entries(stats).map(([key, value], i) => (*/}
          {/*          <div*/}
          {/*              key={`key-${i}`}*/}
          {/*              className={classNames(*/}
          {/*                  'flex flex-col flex-shrink-0 border-r border-olive-500 pl-1 pr-3 gap-3 pt-4 pb-3 sm:gap-5 sm:pr-16 sm:pl-7',*/}
          {/*                  i === 0 ? 'pl-0 sm:pl-0' : '',*/}
          {/*                  i == Object.keys(stats).length - 1 ? 'border-none lg:pr-11' : ''*/}
          {/*              )}*/}
          {/*          >*/}
          {/*              <span className="text-title5">{value}</span>*/}
          {/*              <span className="text-body4 text-olive-600">*/}
          {/*  {STATS_LABELS[key]}*/}
          {/*</span>*/}
          {/*          </div>*/}
          {/*      ))}*/}
          {/*  </div>*/}
          <div>
            <p className={'text-body4'}>OTP: {router.query.otp}</p>
          </div>
        </div>
      </header>
      <div
        className={
          'container flex align-middle justify-center flex-col px-6 gap-8 lg:gap-0 lg:items-center lg:flex-row'
        }
      >
        {otpRes.isSuccess && !otpRes.data && (
          <div className={'flex justify-center'}>
            <div className={'text-black col-span-1 max-w-md pt-4'}>
              <p className={'text-body4'}>
                This link is invalid or has expired.
              </p>
            </div>
          </div>
        )}
        {otpRes.isSuccess && otpRes.data && (
          <div className={'pt-8'}>
            {status !== 'Connected' && status !== 'Connecting' && (
              <div className={' justify-center align-center'}>
                <div className={'flex justify-center'}>
                  <PrimaryButton classes="w-full lg:w-50 " onClick={connect}>
                    Connect
                  </PrimaryButton>
                </div>
                <div className={'flex justify-center'}>
                  <div className={'text-black col-span-1 max-w-md pt-4'}>
                    <p className={'text-body4'}>
                      Begin verification by connecting your wallet.
                    </p>
                  </div>
                </div>
              </div>
            )}
            {/*Disconnected = "Disconnected",*/}
            {/*Connecting = "Connecting",*/}
            {/*Connected = "Connected",*/}
            {/*NotExist = "NotExist",*/}
            {/*Rejected = "Rejected",*/}
            {/*Error = "Error"*/}
            {/*}*/}
            {status === 'NotExist' && (
              <div className={'text-body4'}>Install a wallet to continue</div>
            )}
            {status === 'Connecting' && (
              <div>
                <div className={'text-body4'}>Connecting...</div>
                <DisconnectedButton />
              </div>
            )}
            {status === 'Rejected' && (
              <div>
                <div className={'text-body4'}>Wallet rejected request</div>
                <div className={'text-body4'}>Connecting...</div>
                <DisconnectedButton />
              </div>
            )}

            {status === 'Error' && <div className={'text-body4'}>error</div>}
            {status === 'Connected' && (
              <div className={'grid'}>
                <div className={'gap-3 justify-center items-center flex'}>
                  <PrimaryButton
                    classes="w-full lg:w-50"
                    onClick={loginMutation.mutate}
                    disabled={loginMutation.isLoading}
                  >
                    Prove Wallet Ownership{' '}
                    {loginMutation.data?.duplicate && '(continue anyway)'}
                    {loginMutation.isLoading && <SpinningCircles width={18} />}
                  </PrimaryButton>
                  <DisconnectedButton />
                </div>
                <div
                  className={
                    'gap-3 justify-center items-center flex text-body1 pt-3'
                  }
                >
                  Connected to: {wallet?.address}
                </div>
                <div
                  className={'text-red-500 text-body1 col-span-1 max-w-md pt-4'}
                >
                  <>
                    {typeof loginMutation.error === 'string' &&
                      loginMutation.error}
                    {!!loginMutation.error &&
                      typeof loginMutation.error === 'object' &&
                      'message' in loginMutation.error &&
                      loginMutation.error.message}
                    {!!loginMutation.error &&
                      typeof loginMutation.error === 'string' &&
                      loginMutation.error}
                  </>
                </div>
                <div className={'text-black col-span-1 max-w-md pt-4'}>
                  {loginMutation.isSuccess && loginMutation.data.duplicate && (
                    <span className={'text-body1 text-xl text-red-500'}>
                      Duplicate wallet detected. If you continue verifying this
                      wallet, the existing TG account will lose access to all
                      groups. Click on the same button again to continue
                      anyways.
                    </span>
                  )}
                  {loginMutation.isSuccess && !loginMutation.data.duplicate && (
                    <span className={'text-body1 text-xl'}>
                      {loginMutation.data.allowed
                        ? "You're verified! Check your DMs for your invite link: "
                        : "You don't qualify to join this group. Check your DMs for more info: "}
                      <a
                        href={loginMutation.data.link}
                        target={'_blank'}
                        rel={'noreferrer'}
                      >
                        {loginMutation.data.link}
                      </a>
                    </span>
                  )}
                </div>
                <div className={'col-span-1 max-w-md pt-4'}>
                  <p className={'text-body4 text-black'}>
                    To join a token gated telegram group, you must prove you own
                    your account. Clicking on Prove Wallet Ownership will open
                    Keplr and request a signature. This is an off-chain
                    signature only used to verify wallet ownership by the bot.
                    The signature will be discarded after verification.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default VerifyView
