import { useRouter } from 'next/router'
import { websiteData } from 'constants/websiteData'
import classNames from 'classnames'
import { PrimaryButton } from '@nouns-stream/ui'
import { useMutation } from '@tanstack/react-query'
import { getSigningPublicawesomeClient } from 'stargazejs'
import { useChain } from '@cosmos-kit/react'
import {
  signLoginMessageWithAmino,
  signLoginMessageWithArbitrary,
} from 'libs/verify/keplr'

//todo client side render to grab the OTP, and group.
const chainName = 'stargaze'
const VerifyView: React.FC = () => {
  const router = useRouter()

  const {
    connect,
    disconnect,
    openView,
    status,
    username,
    address,
    message,
    wallet,
    chain: chainInfo,
    logoUrl,
    signArbitrary,
    signAmino,
    getAccount,
    getSigningCosmWasmClient,
  } = useChain(chainName)

  const loginMutation = useMutation(async () => {
    //

    const otp = router.query.otp?.toString()
    if (!otp) {
      throw new Error('no otp')
    }

    const account = await getAccount()
    const signingCosmWasmClient = await getSigningCosmWasmClient()

    // const stargateClient = await getSigningPublicawesomeClient({
    //   rpcEndpoint: 'https://rpc.stargaze-apis.com/',
    //   signer: signingCosmWasmClient,
    // })
    const res1 = await signLoginMessageWithAmino(otp, signAmino)

    // const res = await signLoginMessageWithArbitrary(otp, signArbitrary)
    console.log('res', res1)
    const res = await fetch('/api/verify', {
      method: 'POST',
      body: JSON.stringify({ ...res1.signature, otp, account: account }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) {
      const body = await res.json()
      throw new Error('Failed to verify: ' + body.message)
    }
    const body = await res.json()
    console.log('ITs SUCCESS body', body)
    return body.link as string
  })

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
          {status === 'NotExist' && <div>Install a wallet to continue</div>}
          {status === 'Connecting' && <div>Connecting...</div>}
          {status === 'Rejected' && <div>rejected</div>}
          {status === 'Error' && <div>error</div>}
          {status === 'Connected' && (
            <div className={'grid'}>
              <div className={'gap-3 justify-center items-center flex'}>
                <PrimaryButton
                  classes="w-full lg:w-50"
                  onClick={loginMutation.mutate}
                  disabled={loginMutation.isLoading}
                >
                  Prove Wallet Ownership
                </PrimaryButton>
                <PrimaryButton
                  disabled={loginMutation.isLoading}
                  classes="w-full lg:w-50 bg-gray-400"
                  onClick={disconnect}
                >
                  Disconnect
                </PrimaryButton>
              </div>

              <div className={'text-black col-span-1 max-w-md pt-4'}>
                {loginMutation.error?.toString()}
              </div>
              <div className={'text-black col-span-1 max-w-md pt-4'}>
                {loginMutation.isSuccess && (
                  <span>
                    {"You're verified! Check your DMs for your invite link "}
                    <a
                      href={loginMutation.data}
                      target={'_blank'}
                      rel={'noreferrer'}
                    >
                      {loginMutation.data}
                    </a>
                  </span>
                )}
              </div>
              <div className={'col-span-1 max-w-md pt-4'}>
                <p className={'text-body4 text-black'}>
                  To join a token gated telegram group, you must prove you own
                  your account. Clicking on Prove Wallet Ownership will open
                  Keplr and request a signature. This is an off-chain signature
                  only used to verify wallet ownership by the bot. The signature
                  will be discarded after verification.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default VerifyView
