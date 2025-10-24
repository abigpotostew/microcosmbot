// SPDX-License-Identifier: GPL-3.0-or-later

import React from 'react'
import { DropdownItemProps } from 'libs/types'

const DropdownItem: React.FC<DropdownItemProps> = ({
  onClick,
  label,
  icon,
}) => {
  return (
    <button
      className="w-full flex items-center gap-2 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex-shrink-0 w-5 h-5">{icon}</div>
      <span className="text-label flex-shrink-0">{label}</span>
    </button>
  )
}

export default DropdownItem
