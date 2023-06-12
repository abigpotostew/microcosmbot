// SPDX-License-Identifier: GPL-3.0-or-later

import { PayoutItemProps } from 'libs/types'
import {
  capitalizeFirstLetter,
  getFormattedDate,
  hideString,
} from 'utils/index'
import classNames from 'classnames'
import MenuIcon from 'public/icons/bullet-menu-icon.svg'

const PayoutItem: React.FC<PayoutItemProps> = ({
  address,
  controller,
  recipient,
  type,
  blockTimestamp,
  onClick,
}) => {
  const deployed = getFormattedDate(+blockTimestamp * 1000)
  const labelClassNames = 'text-body4 text-base leading-none'

  return (
    <div
      onClick={onClick}
      className="grid items-center grid-cols-3 grid-rows-2 gap-y-9 py-6 border-b border-gray-200 transition-colors cursor-pointer hover:bg-olive-100 lg:h-10 lg:px-6 lg:border-none lg:py-0 lg:gap-y-0 lg:grid-rows-1 lg:grid-cols-6"
    >
      <div className="col-span-1 flex flex-col gap-3">
        <span className="lg:hidden text-title6">Address</span>
        <span className={labelClassNames}>{hideString(address, 4)}</span>
      </div>
      <div className="col-span-1 flex flex-col gap-3">
        <span className="lg:hidden text-title6">Controller</span>
        <span className={labelClassNames}>{hideString(controller, 4)}</span>
      </div>
      <div className="col-span-1 flex flex-col gap-3">
        <span className="lg:hidden text-title6">Recipient</span>
        <span className={labelClassNames}>{hideString(recipient, 4)}</span>
      </div>
      <div className="col-span-1 flex flex-col gap-3">
        <span className="lg:hidden text-title6">Type</span>
        <span className={labelClassNames}>{capitalizeFirstLetter(type)}</span>
      </div>
      <div className="col-span-1 flex flex-col gap-3">
        <span className="lg:hidden text-title6">Deployed</span>
        <span className={labelClassNames}>{deployed}</span>
      </div>
      <div className="col-span-1 flex justify-end">
        <div
          className={classNames(
            'flex items-center cursor-pointer justify-center border border-olive-500 rounded-lx w-10 h-10'
          )}
        >
          <MenuIcon className="w-5 h-5" />
        </div>
      </div>
    </div>
  )
}

export default PayoutItem
