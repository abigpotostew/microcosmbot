import { useRouter } from 'next/router'
import { useOtp } from '../client/react/hooks/useOtp'
import useWallet from '../client/react/wallet/useWallet'
import { useCallback, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { signLoginMessageWithAmino } from 'libs/verify/keplr'
import { PrimaryButton } from '@microcosmbot/ui'
import { SpinningCircles } from 'react-loading-icons'
type Props = {
  children?: React.ReactNode
}

const ProgressBar = ({ step }: { step: Stages }) => {
  const getStatus = (stage: number) => {
    if (stage === step) return 'current'
    if (stage < step) return 'complete'
    return 'upcoming'
  }
  const steps = [
    { id: 'Step 1', name: 'Connect wallet', href: '#', status: getStatus(0) },
    { id: 'Step 2', name: 'Prove ownership', href: '#', status: getStatus(1) },
    { id: 'Step 3', name: 'Join group', href: '#', status: getStatus(2) },
  ]

  return (
    <nav aria-label="Progress">
      <ol
        role="list"
        className="space-y-2 md:flex md:space-x-8 md:space-y-0 pr-6"
      >
        {steps.map((step) => (
          <li key={step.name} className="md:flex-1">
            {step.status === 'complete' ? (
              <a
                href={step.href}
                className="group flex flex-col border-l-4 border-violet-700 py-2 pl-4 hover:border-violet-800 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
              >
                <span className="text-sm font-medium text-grey-600 group-hover:text-grey-800">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            ) : step.status === 'current' ? (
              <a
                href={step.href}
                className="flex flex-col border-l-4 border-violet-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                aria-current="step"
              >
                <span className="text-sm font-medium text-grey-600">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            ) : (
              <a
                href={step.href}
                className="group flex flex-col border-l-4 border-violet-200 py-2 pl-4 hover:border-violet-300 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
              >
                <span className="text-sm font-medium text-gray-500 group-hover:text-gray-700">
                  {step.id}
                </span>
                <span className="text-sm font-medium">{step.name}</span>
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export type Stages = 0 | 1 | 2
export const VerifyButtons: React.FC<Props> = () => {
  const router = useRouter()
  const otpRes = useOtp()
  const { connect, disconnect, wallet, signAmino, getAccount, status } =
    useWallet()

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
    if (!otpRes.data?.chain.chainId) {
      throw new Error('no chainId')
    }

    const overwrite = !!sig
    let inputSig = sig
    if (!inputSig) {
      const res1 = await signLoginMessageWithAmino(
        otpRes.data?.chain.chainId,
        otp,
        address,
        signAmino
      )

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
        disabled={loginMutation.isLoading || loginMutation.data?.allowed}
        classes="w-full lg:w-50 bg-gray-400"
        onClick={disconnectWallet}
      >
        Disconnect
      </PrimaryButton>
    )
  }

  const stageId: Stages =
    otpRes.isSuccess && otpRes.data && status !== 'Connected'
      ? 0
      : loginMutation.data?.allowed
      ? 2
      : 1

  return (
    <>
      <ProgressBar step={stageId} />
      {otpRes.isSuccess && !otpRes.data && (
        <div className={'flex justify-center'}>
          <div className={'text-black col-span-1 max-w-md pt-4'}>
            <p className={'text-body4'}>This link is invalid or has expired.</p>
          </div>
        </div>
      )}
      {otpRes.isSuccess && otpRes.data && (
        <div className={'pt-8'}>
          {status !== 'Connected' && status !== 'Connecting' && (
            <div className={'grid'}>
              {/*<div className={''}>*/}
              <div
                className={'columns-4 gap-3 justify-center items-center flex'}
              >
                <div className={'justify-center align-center'}>
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
              {/*<div className={''}>*/}
              <div
                className={'columns-2 gap-3 justify-center items-center flex'}
              >
                <PrimaryButton
                  classes="w-full lg:w-50"
                  onClick={loginMutation.mutate}
                  disabled={
                    loginMutation.isLoading || loginMutation.data?.allowed
                  }
                >
                  Prove Wallet Ownership{' '}
                  {loginMutation.data?.duplicate && '(continue anyway)'}
                  {loginMutation.isLoading && (
                    <SpinningCircles width={18} height={18} />
                  )}
                </PrimaryButton>
                <DisconnectedButton />
              </div>
              <div
                className={
                  'gap-3 justify-center items-center flex text-body4 pt-3'
                }
              >
                Connected to: {wallet?.address}
              </div>
              {/*</div>*/}
              {!!loginMutation.error && (
                <div
                  className={
                    'flex items-center justify-center w-full text-red-500 text-body1 pt-4'
                  }
                >
                  <>
                    {typeof loginMutation.error === 'string' &&
                      loginMutation.error}
                    {!!loginMutation.error &&
                      typeof loginMutation.error === 'object' &&
                      'message' in loginMutation.error &&
                      (loginMutation.error as any).message}
                    {!!loginMutation.error &&
                      typeof loginMutation.error === 'string' &&
                      loginMutation.error}
                  </>
                </div>
              )}
              {!!loginMutation.isSuccess && (
                <div
                  className={
                    'text-black col-span-1 max-w-md pt-4  container col-span-1 items-center justify-center max-w-sm '
                  }
                >
                  {loginMutation.isSuccess && loginMutation.data.duplicate && (
                    <span className={'text-body1 text-xl text-red-500'}>
                      Duplicate wallet detected. If you continue verifying this
                      wallet, the existing TG account will lose access to all
                      groups. Click on the same button again to continue
                      anyways.
                    </span>
                  )}
                  {loginMutation.isSuccess && !loginMutation.data.duplicate && (
                    <span className={'text-body1 text-l'}>
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
              )}
              {!loginMutation.data?.allowed && (
                <div
                  className={
                    'container col-span-1 items-center justify-center max-w-sm pt-4'
                  }
                >
                  <p className={' text-body4 text-black'}>
                    Clicking on Prove Wallet Ownership will request an off-chain
                    signature used only to verify wallet ownership by the bot.
                    The signature will be discarded after verification.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </>
  )
}
