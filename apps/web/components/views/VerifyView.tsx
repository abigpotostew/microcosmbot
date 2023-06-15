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
      throw new Error('failed to verify')
    }
    const body = await res.json()
    console.log('ITs SUCCESS body', body)
  })

  return (
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
        <div>OTP: {router.query.otp}</div>
        {status !== 'Connected' && status !== 'Connecting' && (
          <PrimaryButton classes="w-full lg:w-50" onClick={connect}>
            Connect
          </PrimaryButton>
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
          <div>
            <PrimaryButton
              classes="w-full lg:w-50"
              onClick={loginMutation.mutate}
            >
              Sign Message & Verify
            </PrimaryButton>
            <PrimaryButton classes="w-full lg:w-50" onClick={disconnect}>
              Disconnect
            </PrimaryButton>
          </div>
        )}
      </div>
    </header>
  )
}

export default VerifyView
