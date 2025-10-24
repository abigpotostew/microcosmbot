// SPDX-License-Identifier: GPL-3.0-or-later
import type { NextPage } from 'next'

import { PageSEO } from 'components/SEO'
import { websiteMetadata } from 'constants/index'
import HeroSection from 'components/sections/HeroSection'
import BenefitsSection from 'components/sections/BenefitsSection'
import WTFSection from 'components/sections/WTFSection'

const Home: NextPage = () => {
  return (
    <>
      <PageSEO
        title={`${websiteMetadata.title} | Home`}
        description={websiteMetadata.description}
      />
      <HeroSection />
      <BenefitsSection />
      <WTFSection />
    </>
  )
}

export default Home
