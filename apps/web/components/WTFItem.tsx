// SPDX-License-Identifier: GPL-3.0-or-later

import { useState } from 'react'
import MinusIcon from 'public/icons/minus-icon.svg'
import PlusIcon from 'public/icons/plus-icon.svg'

interface Props {
  title: string
  text: string | JSX.Element
  video?: JSX.Element
}

const WTFItem: React.FC<Props> = ({ title, text, video }) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative flex flex-col items-start w-full border-t border-gray-100 pt-5 pb-8 xl:pt-6 xl:pb-9">
      <div className="flex justify-between w-full">
        <h3
          className="text-title2 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {title}
        </h3>
        <div
          className="w-8 h-8 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <MinusIcon className="w-full" />
          ) : (
            <PlusIcon className="w-full" />
          )}
        </div>
      </div>
      {isOpen ? (
          <div><p className="text-body1 max-w-full mt-6 whitespace-pre-line">{text}</p>{video}</div>
      ) : null}
    </div>
  )
}

export default WTFItem
