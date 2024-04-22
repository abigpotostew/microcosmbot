import { useRouter } from 'next/router'
import { websiteData } from 'constants/websiteData'
import { FC } from 'react'
import { SpinningCircles } from 'react-loading-icons'
import VerifyWtfBox from 'components/VerifyWtfBox'
import FrameBlock from 'components/FrameBlock'
import { useOtp } from '../../client/react/hooks/useOtp'
import { WalletProvider } from 'client/react/wallet/WalletContext'
import WalletProviderRoot from '../../client/react/wallet/WalletProviderRoot'

//todo client side render to grab the OTP, and group.
const VerifyView: React.FC = () => {
  const router = useRouter()
  const otpRes = useOtp()

  type TopSectionProps = {
    loading: boolean
  }
  const TopSection: FC<TopSectionProps> = ({ loading }: TopSectionProps) => {
    return (
      <header className="relative z-50 bg-olive-200 pt-8 pb-8 lg:pb-9">
        <div className="container flex flex-col px-6 gap-8 lg:gap-0 lg:items-center lg:flex-row">
          <div className="flex flex-col gap-4 flex-grow flex-shrink-0">
            <h1 className="text-title2">Join Group</h1>
            <p className="text-body4 text-olive-600">
              <span>{websiteData.verifySection.subtitle}</span>
            </p>
          </div>
          <div>
            <p className={'text-body3'}>One time code: {router.query.otp}</p>
            <p className={'text-body4 text-olive-600'}>
              (Do not share this code with anyone)
            </p>
          </div>
        </div>
      </header>
    )
  }

  const loading = otpRes.isLoading

  return (
    <>
      <TopSection loading={loading} />
      <div
        className={
          'pt-4 pb-4 container flex align-middle justify-center flex-col md:px-6 gap-8 col-span-8 lg:items-center lg:flex-col'
        }
      >
        {/*<div*/}
        {/*  className={*/}
        {/*    'container flex align-middle justify-center flex-col px-6 gap-8 lg:gap-0 lg:items-center lg:flex-row'*/}
        {/*  }*/}
        {/*>*/}

        <div className={'grid'}>
          {loading && (
            <FrameBlock
              classes={'container bg-olive-200 mx-auto animate-pulse'}
            >
              <div
                className={
                  'h-152 sm:w-64 lg:w-233  flex justify-center items-center text-black '
                }
              >
                <SpinningCircles width={36} height={36} />
              </div>
            </FrameBlock>
          )}
          {!loading && !!otpRes.data && (
            <>
              <WalletProvider chainName={otpRes.data.chain.useChainName}>
                <VerifyWtfBox otp={otpRes.data || null} />
              </WalletProvider>
            </>
          )}
          {!loading && !otpRes.data && (
            <FrameBlock
              classes={
                'container bg-olive-200 mx-auto pt-4 pb-4 container flex align-middle justify-center flex-col md:px-6 gap-8 col-span-8 lg:items-center lg:flex-col'
              }
            >
              <div className={'text-body4'}>
                This verify url was either not found or already used. If
                you&apos;re having trouble, try verifying with the bot again.
              </div>
            </FrameBlock>
          )}
        </div>
      </div>
    </>
  )
}

export default VerifyView
