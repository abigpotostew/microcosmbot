// SPDX-License-Identifier: GPL-3.0-or-later

import { TransactionLoadingStates } from 'libs/types'
import { atom } from 'recoil'

export const transactionState = atom<TransactionLoadingStates>({
  key: 'transactionState',
  default: {
    steps: {
      approval: {
        status: 'pending',
        text: 'Waiting for transaction approval',
      },
      deploy: {
        status: 'pending',
        text: 'Deploying contract for new payout',
      },
    },
    contractTransaction: undefined,
  },
})
