// SPDX-License-Identifier: GPL-3.0-or-later

import { atom } from 'recoil'

export interface ModalStateProps {
  isModalOpen: boolean
  modalChildren: JSX.Element | null
  onCloseCb?: () => void
}

export const modalState = atom<ModalStateProps>({
  key: 'modalState',
  default: {
    isModalOpen: false,
    modalChildren: null,
    onCloseCb: undefined,
  },
})
