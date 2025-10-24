// SPDX-License-Identifier: GPL-3.0-or-later

import { atom } from 'recoil'

export interface MobileMenuStateProps {
  mobileMenuIsOpened: boolean
}

export const mobileMenuState = atom<MobileMenuStateProps>({
  key: 'mobileMenuState',
  default: {
    mobileMenuIsOpened: false,
  },
})
