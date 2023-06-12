import { Fragment } from 'react'
import clsx from 'clsx'
import Highlight, { defaultProps } from 'prism-react-renderer'
import { Button } from 'components/Button'
import HeroImage from 'public/icons/docs-image.svg'

const codeLanguage = 'javascript'
const code = `export default {
  strategy: 'predictive',
  engine: {
    cpus: 12,
    backups: ['./storage/cache.wtf'],
  },
}`

const tabs = [
  { name: 'cache-advance.config.js', isActive: true },
  { name: 'package.json', isActive: false },
]

function TrafficLightsIcon(props: any) {
  return (
    <svg aria-hidden="true" viewBox="0 0 42 10" fill="none" {...props}>
      <circle cx="5" cy="5" r="4.5" />
      <circle cx="21" cy="5" r="4.5" />
      <circle cx="37" cy="5" r="4.5" />
    </svg>
  )
}

export function Hero() {
  return (
    <div className="bg-olive-900">
      <div className="py-16 px-6 lg:relative lg:py-20 xl:px-0">
        <div className="mx-auto grid grid-cols-1 items-center gap-y-16 gap-x-8 lg:max-w-8xl lg:grid-cols-2 xl:max-w-docs-desktop xl:gap-x-16">
          <div className="relative z-10">
            <div className="flex flex-col gap-6 w-133 max-w-full">
              <p className="text-title1 text-white">
                Never miss the cache again.
              </p>
              <p className="text-body3 leading-8 text-amber-50 w-105 max-w-full">
                Cache every single thing your app could ever do ahead of time,
                so your code never even has to run at all.
              </p>
              <div className="mt-2 flex flex-col md:flex-row gap-4">
                <Button className="" href="/">Get started</Button>
                <Button className="" href="/" variant="secondary">
                  View on GitHub
                </Button>
              </div>
            </div>
          </div>
          <div className="relative lg:static xl:pl-10">
            <HeroImage className="hidden pointer-events-none w-570px max-w-full lg:block" />
          </div>
        </div>
      </div>
    </div>
  )
}
