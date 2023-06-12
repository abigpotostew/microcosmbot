// SPDX-License-Identifier: GPL-3.0-or-later

import { BigNumber } from 'ethers'
import { atom } from 'recoil'

export interface IMilestones {
  owner: `0x${string}` | undefined
  msPayments: BigNumber[]
  msDates: BigNumber[]
  tip: BigNumber | undefined
  recipient: string | undefined
  paused: boolean | undefined
  deterministicAddress: string | undefined
}

export const milestoneformState = atom({
  key: 'milestonesState',
  default: {
    owner: undefined,
    msPayments: [''],
    msDates: [Math.floor(Date.now() / 1000)],
    tip: '0',
    recipient: undefined,
    paused: false,
    deterministicAddress: '',
  },
})
