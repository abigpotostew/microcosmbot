// SPDX-License-Identifier: GPL-3.0-or-later

import { useState } from 'react'
import { SelectProps } from 'libs/types/select'
import DropdownIcon from 'public/icons/dropdown-icon.svg'
import classNames from 'classnames'
import EthIcon from 'public/icons/eth-icon.svg'
import { getKeyByValue } from 'utils/index'

const Select: React.FC<SelectProps> = ({
  onChange,
  options,
  currentOption,
  iconLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  const selectOption = (option: any) => {
    if (option !== currentOption) {
      onChange(option)
    }
  }

  const isOptionSelected = (option: any) => {
    return option === currentOption
  }

  return (
    <div
      onBlur={() => setIsOpen(false)}
      onClick={() => setIsOpen((prev) => !prev)}
      tabIndex={0}
      className={classNames('relative flex w-full z-10', isOpen ? 'z-20' : '')}
    >
      <div className="flex pointer-events-auto items-center outline-none cursor-pointer p-6px gap-1 xl:px-2 rounded-md bg-olive-300">
        <span className="capitalize text-body4">
          {getKeyByValue(options, currentOption)}
        </span>
        {iconLabel ? <div className="flex-shrink-0 w-5 h-5">{iconLabel}</div> : null}
        <DropdownIcon
          aria-hidden="true"
          className="w-5 h-5 origin-center transition-transform flex-shrink-0"
          style={{ transform: `rotate(${isOpen ? '180deg' : 0})` }}
        />
      </div>
      {isOpen && Object.keys(options).length ? (
        <ul className="absolute top-10 -right-6px max-w-33 max-h-139px box-border overflow-y-scroll bg-olive-100 border border-gray-900 rounded-lx flex flex-col gap-2px py-2 pr-3 pl-6px">
          {Object.entries(options).map(([key, value], index) => (
            <li
              onClick={(e) => {
                e.stopPropagation()
                selectOption(value)
                setIsOpen(false)
              }}
              key={index}
              className={`flex items-center min-w-28 max-w-full gap-6px cursor-pointer transition-colors rounded p-2px hover:bg-olive-200 ${
                isOptionSelected(value) ? 'bg-olive-200' : ''
              }`}
            >
              {iconLabel ? (
                <div className="w-5 h-5 flex-shrink-0">
                  <EthIcon className="w-full h-full" />
                </div>
              ) : null}
              <span className="text-label capitalize">{key}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

export default Select
