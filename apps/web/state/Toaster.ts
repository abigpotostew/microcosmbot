// SPDX-License-Identifier: GPL-3.0-or-later

import { atom } from 'recoil'

export interface ToasterStateProps {
  currentMessage: string
  queue: string[]
}

export const toasterState = atom<ToasterStateProps>({
  key: 'toasterState',
  default: {
    currentMessage: '',
    queue: [],
  },
})
