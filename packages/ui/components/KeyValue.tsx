import * as React from 'react'
import { FC } from 'react'
import classNames from 'classnames'

interface KeyValueProps {
  labelTextScreenReader: string
  label: React.ReactNode
  children: React.ReactNode
  className?: string
}
export const KeyValue: FC<KeyValueProps> = ({
  labelTextScreenReader,
  label,
  children,
  className,
}) => {
  return (
    <div
      className={classNames(' flex w-full flex-none gap-x-4 px-6', className)}
    >
      <dt className="flex-none">
        <span className="sr-only">{labelTextScreenReader}</span>
        {label}
      </dt>
      <dd className="text-sm font-medium leading-6 text-gray-900">
        {children}
      </dd>
    </div>
  )
}
