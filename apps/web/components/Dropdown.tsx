// SPDX-License-Identifier: GPL-3.0-or-later

import React from 'react'
import classNames from 'classnames'
import { DropdownProps } from 'libs/types'
import DropdownIcon from 'public/icons/dropdown-icon.svg'
import MenuIcon from 'public/icons/bullet-menu-icon.svg'
import CloseIcon from 'public/icons/close-icon.svg'

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  isOpen,
  setIsOpen,
}) => {
  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      tabIndex={0}
      className={classNames('relative flex z-10', isOpen ? 'z-20' : '')}
    >
      <div className="hidden pointer-events-auto items-center justify-between box-border outline-none cursor-pointer min-w-30 h-11 gap-2 pr-3 pl-4 rounded-lx border border-gray-900 lg:flex">
        <span className="text-body4 leading-4 text-olive-600">{label}</span>
        <DropdownIcon
          aria-hidden="true"
          className="w-5 h-5 origin-center transition-transform flex-shrink-0"
          style={{ transform: `rotate(${isOpen ? '180deg' : 0})` }}
        />
      </div>
      <div
        className={classNames(
          'flex items-center cursor-pointer justify-center border border-olive-500 rounded-lx w-10 h-10 hover:bg-olive-100 lg:hidden',
          isOpen ? 'bg-olive-100' : ''
        )}
      >
        <MenuIcon className="w-5 h-5" />
      </div>
      {isOpen && options.length ? (
        <>
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 lg:hidden"
          ></div>
          <ul className="fixed left-0 bottom-0 box-border border-t w-full select-none bg-olive-100 border-gray-900 flex flex-col gap-4 px-6 py-8 lg:gap-2px lg:py-2 lg:px-6px lg:absolute lg:top-11 lg:bottom-auto lg:max-h-30 lg:w-max lg:overflow-y-scroll lg:rounded-lx lg:border">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 flex items-center justify-center w-7 h-7 lg:hidden"
            >
              <CloseIcon className="w-5 h-5" />
            </button>
            {options.map((option, index) => (
              <li
                key={index}
                className="transition-colors p-1 lg:p-2px rounded-md hover:bg-olive-200"
              >
                {option}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  )
}

export default Dropdown
