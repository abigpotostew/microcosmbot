import Link from 'next/link'

import { Icon } from 'components/Icon'

export function QuickLinks({ children }: any) {
  return (
    <div className="not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
      {children}
    </div>
  )
}

export function QuickLink({ title, description, href, icon }: any) {
  return (
    <div className="group relative rounded-xl border border-olive-700 hover:bg-olive-800">
      <div className="relative overflow-hidden rounded-xl p-6">
        <Icon icon={icon} className="h-8 w-8" />
        <h2 className="text-body4 font-medium leading-8 text-white mt-4">
          <Link href={href}>
            <span className="absolute -inset-px rounded-xl" />
            {title}
          </Link>
        </h2>
        <p className="text-body4 text-olive-100 mt-2">
          {description}
        </p>
      </div>
    </div>
  )
}
