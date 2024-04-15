// SPDX-License-Identifier: GPL-3.0-or-later

import React, { useCallback, useEffect, useRef } from 'react'
import classNames from 'classnames'
import CloseIcon from 'public/icons/close-icon.svg'

interface ModalProps {
  content: JSX.Element | null
  isOpen: boolean
  onClose: () => void
  onCloseCb?: () => void
  closeOnEsc?: boolean
  closeOnClickOutside?: boolean
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onCloseCb,
  content,
  closeOnClickOutside,
  closeOnEsc = true,
}) => {
  const container = useRef<HTMLDivElement>(null)

  const handleClose = useCallback(() => {
    onClose()
    !!onCloseCb && onCloseCb()
  }, [onClose, onCloseCb])

  const onOverlayClick = (e: React.MouseEvent) => {
    if (!container.current?.contains(e.target as Node)) handleClose()
  }

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      switch (e.key) {
        case 'Escape': {
          if (closeOnEsc) handleClose()
          break
        }
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => window.removeEventListener('keydown', onKeyDown)
  }, [closeOnEsc, handleClose, isOpen])

  return (
    <div
      className={classNames(
        'fixed inset-0 z-50 bg-olive-600/60 overflow-hidden flex items-center justify-center',
        `${isOpen ? 'visible' : 'invisible'}`
      )}
      onClick={closeOnClickOutside ? onOverlayClick : undefined}
    >
      <div className="relative w-full max-w-[700px] mx-auto" ref={container}>
        <div>{content}</div>
        <button
          className="absolute top-6 right-6 flex items-center justify-center cursor-pointer select-none outline-none z-50"
          onClick={handleClose}
          title="Bye bye 👋"
        >
          <CloseIcon className="h-7 w-7" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
