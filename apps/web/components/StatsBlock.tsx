// SPDX-License-Identifier: GPL-3.0-or-later

import { websiteData } from 'constants/index'
import { PrimaryButton } from '@nouns-stream/ui'
import { IPayoutsStats } from 'libs/types'
import classNames from 'classnames'
import { useRouter } from 'next/router'

const STATS_LABELS: Record<string, string> = {
  total: 'Total payouts',
  senders: 'Unique senders',
  receivers: 'Unique receivers',
}

const StatsBlock: React.FC<IPayoutsStats> = (stats) => {
  const router = useRouter()

  return (
    <header className="relative z-50 bg-olive-200 pt-16 pb-8 lg:pb-9">
      <div className="container flex flex-col px-6 gap-8 lg:gap-0 lg:items-center lg:flex-row">
        <div className="flex flex-col gap-4 flex-grow flex-shrink-0">
          <h1 className="text-title2">{websiteData.payoutSection.title}</h1>
          <p className="text-body4 text-olive-600">
            {websiteData.payoutSection.subtitle}
          </p>
        </div>
        <div className="flex items-center justify-between mb-4 sm:justify-start lg:mb-0">
          {Object.entries(stats).map(([key, value], i) => (
            <div
              key={`key-${i}`}
              className={classNames(
                'flex flex-col flex-shrink-0 border-r border-olive-500 pl-1 pr-3 gap-3 pt-4 pb-3 sm:gap-5 sm:pr-16 sm:pl-7',
                i === 0 ? 'pl-0 sm:pl-0' : '',
                i == Object.keys(stats).length - 1 ? 'border-none lg:pr-11' : ''
              )}
            >
              <span className="text-title5">{value}</span>
              <span className="text-body4 text-olive-600">
                {STATS_LABELS[key]}
              </span>
            </div>
          ))}
        </div>
        <PrimaryButton
          classes="w-full lg:w-50"
          onClick={() => router.push('/')}
        >
          Make a payout
        </PrimaryButton>
      </div>
    </header>
  )
}

export default StatsBlock
