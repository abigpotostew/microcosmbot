// SPDX-License-Identifier: GPL-3.0-or-later

import { BigNumber } from 'ethers'
import { atom } from 'recoil'

export interface IIntervals {
  owner: `0x${string}`
  startDate: BigNumber | number | string
  endDate: BigNumber | number | string
  owed: BigNumber | string
  interval: BigNumber | number | string
  tip: BigNumber | string | undefined
  recipient: string | undefined
  paused: boolean | undefined
  deterministicAddress: string | undefined
}

export const intervalsState = atom({
  key: 'intervalsState',
  default: {
    owner: undefined,
    startDate: Math.floor(Date.now() / 1000),
    endDate: Math.floor(Date.now() / 1000),
    owed: '',
    interval: '',
    tip: '0',
    recipient: undefined,
    paused: false,
    deterministicAddress: undefined,
  },
})
