// SPDX-License-Identifier: GPL-3.0-or-later
import type { NextPage } from 'next'

import { PageSEO } from 'components/SEO'
import { websiteMetadata } from 'constants/index'
import TOSSection from 'components/sections/TOSSection'

const TermsOfService: NextPage = () => {
  return (
    <>
      <PageSEO
        title={`${websiteMetadata.title} | Terms of service`}
        description={websiteMetadata.description}
      />
      <TOSSection />
    </>
  )
}

export default TermsOfService
