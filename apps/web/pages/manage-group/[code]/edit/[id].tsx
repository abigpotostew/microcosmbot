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
import ManageGroupView from 'components/views/ManageGroupView'
import { EditGroupTokenGateView } from 'components/views/EditGroupTokenGateView'
import { trpc } from 'utils/trpc'

const statsMock: IPayoutsStats = {
  total: 1231,
  senders: 333,
  receivers: 545,
}

const StreamDetails: NextPage = () => {
  const router = useRouter()

  const { id, code } = router.query

  const rule = trpc.manageGroup.getRule.useQuery(
    {
      code: code?.toString() as string,
      id: id?.toString() as string,
    },
    { enabled: !!code && !!id }
  )
  if (!id || !code) {
    return <div>Invalid URL</div>
  }
  if (rule.isLoading) {
    return <div>Loading...</div>
  }
  if (rule.error) {
    return <div>Error: {rule.error.message}</div>
  }
  if (!rule.data) {
    return <div>Not Found</div>
  }
  if (rule.data.group.groupTokenGate.length !== 1) {
    return <div>Not Found</div>
  }
  const ruletoken = rule.data.group.groupTokenGate[0]
  return (
    <>
      <PageSEO
        title={`${websiteMetadata.title} | Manage Group`}
        description={websiteMetadata.description}
      />
      {/*<StatsBlock {...statsMock} />*/}
      {/*<StreamSection />*/}
      <EditGroupTokenGateView rule={ruletoken} manageGroup={rule.data} />
    </>
  )
}

export default dynamic(() => Promise.resolve(StreamDetails), {
  ssr: false,
})
