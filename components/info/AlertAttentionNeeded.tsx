import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
// @flow
import * as React from 'react'

type Props = {
  children: React.ReactNode
}

const AlertAttentionNeeded: React.FC<Props> = ({ children }: Props) => {
  return (
    <div className="rounded-md bg-yellow-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationTriangleIcon
            className="h-5 w-5 text-yellow-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">Attention</h3>
          <div className="mt-2 text-sm text-yellow-700 text-body4">
            <p>Do not share this link with anyone</p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AlertAttentionNeeded
