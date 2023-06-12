// SPDX-License-Identifier: GPL-3.0-or-later

import { atom } from 'recoil'

export interface LoadingStateProps {
  isLoading: boolean
}

export const loadingState = atom<LoadingStateProps>({
  key: 'loadingState',
  default: {
    isLoading: false,
  },
})
