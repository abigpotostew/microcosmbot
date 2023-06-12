// SPDX-License-Identifier: GPL-3.0-or-later
import type { NextPage } from 'next'

import { PageSEO } from 'components/SEO'
import { websiteMetadata } from 'constants/index'
import ProtocolDisclaimer from 'components/sections/ProtocolDisclaimer'

const TermsOfService: NextPage = () => {
  return (
    <>
      <PageSEO
        title={`${websiteMetadata.title} | Protocol Disclaimer`}
        description={websiteMetadata.description}
      />
      <ProtocolDisclaimer />
    </>
  )
}

export default TermsOfService
