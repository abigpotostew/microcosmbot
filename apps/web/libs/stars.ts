import { z } from 'zod'
import { fromBech32, toBech32 } from 'cosmwasm'

export const zodStarsContractAddress = z
  .string()
  .length(64)
  .refine((val) => isStarAddress(val), 'Invalid stars address')

export const zodStarsAddress = z
  .string()
  .length(44)
  .refine((val) => isStarAddress(val), 'Invalid stars address')

export const isStarAddress = (addr: string) => {
  try {
    toStars(addr)
    return true
  } catch (e) {
    return false
  }
}

const compatiblePrefixes = ['stars']

export const toStars = (addr: string) => {
  try {
    const { prefix, data } = fromBech32(addr)
    // limit to prefixes coin type 118, known to work with keplr
    // https://medium.com/chainapsis/keplr-explained-coin-type-118-9781d26b2c4e

    if (!compatiblePrefixes.includes(prefix)) {
      throw new Error('Address not compatible with Keplr: ' + addr)
    }
    const starsAddr = toBech32('stars', data)
    // wallet address length 20, contract address length 32
    if (![20, 32].includes(data.length)) {
      throw new Error('Invalid address: ' + addr + ' ' + starsAddr)
    }
    addr = starsAddr
    return addr
  } catch (e) {
    throw new Error('Invalid address: ' + addr + ',' + e)
  }
}
