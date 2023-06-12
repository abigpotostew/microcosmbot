// SPDX-License-Identifier: GPL-3.0-or-later

import FrameBlock from 'components/FrameBlock'
import { useState } from 'react'
import { MilestonesForm } from 'components/MilestonesForm'
import { IntervalsForm } from 'components/IntervalsForm'
import HeroBg from 'public/icons/hero-bg.svg'
import PhaseIcon from 'public/icons/phased-icon.svg'
import PeriodicIcon from 'public/icons/periodic-icon.svg'
import classNames from 'classnames'
import { websiteData } from 'constants/index'
import Image from 'next/image'

const HeroSection: React.FC = () => {
  const tabs = [
    { name: 'phased', val: 'milestones', icon: <PhaseIcon className="w-5" /> },
    {
      name: 'periodic',
      val: 'Intervals',
      icon: <PeriodicIcon className="w-5" />,
    },
  ]

  const [tab, setTab] = useState(tabs[0].val)

  return (
    <section className="relative pt-4 pb-24 xl:pt-8 bg-olive-200 overflow-hidden">
      <div className="container flex flex-col px-6 items-center md:flex-row md:gap-14 md:items-start xl:justify-center xl:gap-32 2xl:gap-48">
        <div className="image-container flex w-80 h-89 md:w-95 md:h-105 md:mt-28 lg:w-116 lg:h-129">
          <Image
            fill
            className="image flex"
            src={websiteData.heroSection.imageSrc}
            alt="Nouns Stream hero image"
            priority
          />
        </div>
        <FrameBlock classes="w-500px max-w-full px-6 py-4 box-border bg-olive-100 xl:px-10 xl:py-5">
          <nav
            className="relative flex w-full border-b border-gray-900"
            aria-label="Tabs"
          >
            {tabs.map((_tab) => (
              <div
                key={_tab.name}
                onClick={() => setTab(_tab.val)}
                className={classNames(
                  'flex justify-center basis-1/2 pb-5 items-center gap-2 cursor-pointer',
                  tab === _tab.val ? 'opacity-100' : 'opacity-50'
                )}
                aria-current={tab === _tab.val ? 'page' : undefined}
              >
                {_tab.icon}
                <span className="text-title5 capitalize">{_tab.name}</span>
              </div>
            ))}
            <div
              className="absolute bottom-0 left-0 w-1/2 h-1 transition-transform bg-gray-900"
              style={{
                transform: `translateX(${tab === tabs[0].val ? 0 : '100%'})`,
              }}
            />
          </nav>
          <div className="w-full">
            {tab === tabs[0].val && <MilestonesForm />}
            {tab === tabs[1].val && <IntervalsForm />}
          </div>
        </FrameBlock>
      </div>
      <HeroBg className="absolute w-300 min-w-full xl:w-full bottom-0 left-0" />
    </section>
  )
}

export default HeroSection
