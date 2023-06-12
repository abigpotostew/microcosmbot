// SPDX-License-Identifier: GPL-3.0-or-later

import { useCallback, useEffect, useRef } from 'react'
import CheckIcon from 'public/icons/check-icon.svg'
import { useRecoilState } from 'recoil'
import {
  toasterState as toasterInitState,
  ToasterStateProps,
} from 'state/Toaster'

const LIFE_TIME = 3000

const Toaster: React.FC = () => {
  const [toasterState, setToasterState] = useRecoilState(toasterInitState)
  const timer = useRef<number | null>(null)
  const { queue, currentMessage } = toasterState

  const toastRef = useRef<HTMLDivElement>(null)

  const processNext = useCallback(() => {
    if (!queue?.length) {
      return
    }

    const msg = queue.at(0) as string
    const q = queue.slice(1)
    setToasterState((prev: ToasterStateProps) => {
      return {
        ...prev,
        currentMessage: msg,
        queue: q,
      }
    })

    timer.current = window.setTimeout(() => {
      setToasterState((prev: ToasterStateProps) => {
        return {
          ...prev,
          currentMessage: '',
        }
      })
    }, LIFE_TIME)
  }, [queue]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (currentMessage?.length) {
      return
    }

    processNext()
  }, [currentMessage?.length, processNext])

  useEffect(() => {
    return () => {
      if (timer.current !== null) {
        window.clearTimeout(timer.current)
      }
    }
  }, [])

  if (!currentMessage?.length && !queue?.length) {
    return null
  }

  return (
    <div
      ref={toastRef}
      className="fixed left-1/2 -translate-x-1/2 top-6 flex items-center gap-2 py-2 px-3 border border-olive-600 bg-olive-100 rounded-lx z-50 box-border"
    >
      <span className="text-body3">{currentMessage}</span>
      <CheckIcon className="w-5 h-5" />
    </div>
  )
}

export default Toaster
