import { useRouter } from 'next/router'
import { websiteData } from 'constants/websiteData'
import { PrimaryButton } from '@microcosmbot/ui'
import { useMutation } from '@tanstack/react-query'
import { signLoginMessageWithAmino } from 'libs/verify/keplr'
import { FC, useCallback, useState } from 'react'
import { trpc } from 'utils/trpc'
import { SpinningCircles } from 'react-loading-icons'
import useWallet from '../../client/react/wallet/useWallet'
import VerifyWtfBox from 'components/VerifyWtfBox'
import FrameBlock from 'components/FrameBlock'
import { useOtp } from '../../client/react/hooks/useOtp'
import { VerifyButtons } from 'components/VerifyButtons'

//todo client side render to grab the OTP, and group.
const VerifyView: React.FC = () => {
  const router = useRouter()
  const otpRes = useOtp()

  type TopSectionProps = {
    loading: boolean
  }
  const TopSection: FC<TopSectionProps> = ({ loading }: TopSectionProps) => {
    return (
      <header className="relative z-50 bg-olive-200 pt-16 pb-8 lg:pb-9">
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

  if (loading) return <TopSection loading={loading}></TopSection>

  return (
    <>
      <TopSection loading={loading} />
      <div
        className={
          'pt-4 pb-4 container flex align-middle justify-center flex-col px-6 gap-8 col-span-8 lg:items-center lg:flex-col'
        }
      >
        {/*<div*/}
        {/*  className={*/}
        {/*    'container flex align-middle justify-center flex-col px-6 gap-8 lg:gap-0 lg:items-center lg:flex-row'*/}
        {/*  }*/}
        {/*>*/}

        <div className={'grid'}>
          <VerifyWtfBox otp={otpRes.data || null} />
        </div>
      </div>
    </>
  )
}

export default VerifyView
