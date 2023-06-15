// SPDX-License-Identifier: GPL-3.0-or-later

import type { NextPage } from 'next'
import { PageSEO } from 'components/SEO'
import { websiteMetadata } from 'constants/index'
import { IPayoutsStats } from 'libs/types'
import { useRouter } from 'next/router'
import StreamSection from 'components/sections/StreamSection'
import StatsBlock from 'components/StatsBlock'
import dynamic from 'next/dynamic'
import VerifyView from 'components/views/VerifyView'

const statsMock: IPayoutsStats = {
  total: 1231,
  senders: 333,
  receivers: 545,
}

const StreamDetails: NextPage = () => {
  const router = useRouter()

  return (
    <>
      <PageSEO
        title={`${websiteMetadata.title} | Verify`}
        description={websiteMetadata.description}
      />
      {/*<StatsBlock {...statsMock} />*/}
      {/*<StreamSection />*/}
      <VerifyView />
    </>
  )
}

export default dynamic(() => Promise.resolve(StreamDetails), {
  ssr: false,
})
