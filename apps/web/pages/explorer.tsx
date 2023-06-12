// SPDX-License-Identifier: GPL-3.0-or-later

import type { NextPage } from 'next'
import { PageSEO } from 'components/SEO'
import { websiteMetadata } from 'constants/index'
import PayoutSection from 'components/sections/PayoutSection'
import { IPayoutsStats } from 'libs/types'
import { useRouter } from 'next/router'
import { capitalizeFirstLetter } from 'utils/index'
import StatsBlock from 'components/StatsBlock'
import dynamic from 'next/dynamic'

const statsMock: IPayoutsStats = {
  total: 1231,
  senders: 333,
  receivers: 545,
}

const Explorer: NextPage = () => {
  const router = useRouter()
  const titlePageName =
    capitalizeFirstLetter(`${router.pathname}`.slice(1)) ?? 'Explorer'

  return (
    <>
      <PageSEO
        title={`${websiteMetadata.title} | ${titlePageName}`}
        description={websiteMetadata.description}
      />
      <StatsBlock {...statsMock} />
      <PayoutSection />
    </>
  )
}

export default dynamic(() => Promise.resolve(Explorer), {
  ssr: false,
})
