// SPDX-License-Identifier: GPL-3.0-or-later

interface Addresses {
  [key: string]: {
    MilestonesFactoryProxy?: string
    IntervalsFactoryProxy?: string
    ManagerProxy?: string
  }
}

export const addresses: Addresses = {
  goerli: {
    ManagerProxy: '0xb6E0407F0094816a67b7d6E2FA27a87be9396f05',
  },
}
