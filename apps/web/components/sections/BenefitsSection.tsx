// SPDX-License-Identifier: GPL-3.0-or-later

import BenefitsBg from 'public/icons/benefits-texture.svg'
import { websiteData } from 'constants/index'
import BenefitItem from 'components/BenefitItem'

const BenefitsSection: React.FC = () => {
  return (
    <section className="relative bg-olive-300 pt-20 pb-30 overflow-hidden lg:pt-32 lg:pb-40">
      <div className="container flex flex-col items-center gap-16 lg:flex-row lg:justify-center lg:items-start xl:gap-32 2xl:gap-48">
        {websiteData.benefitsSection.benefits.map((b) => (
          <BenefitItem
            key={b.title}
            title={b.title}
            description={b.description}
            icon={b.icon}
          />
        ))}
      </div>
      <BenefitsBg className="absolute w-300 min-w-full xl:w-full bottom-0 left-0" />
    </section>
  )
}

export default BenefitsSection
