import { Window } from '@keplr-wallet/types'
import { SigningCosmWasmClient } from 'cosmwasm'
import { buildMessage } from './build-mesage'
import { StdSignature } from '@cosmjs/amino'

export const signLoginMessageWithArbitrary = async (
  otp: string,
  signArbitrary: (
    signer: string,
    data: string | Uint8Array
  ) => Promise<StdSignature>
) => {
  const keplrWindow = <Window>window
  const keplr = keplrWindow.keplr
  if (!keplr) {
    throw new Error('Keplr not installed')
  }
  const chainId = 'stargaze-1'
  const key = await keplr.getKey(chainId)

  const userAddress = key.bech32Address
  // const signature = await keplr.signArbitrary(
  //   chainId,
  //   userAddress,
  //   JSON.stringify(buildMessage(otp))
  // )
  const signature = await signArbitrary(
    userAddress,
    JSON.stringify(buildMessage(otp))
  )

  return {
    signature,
    address: userAddress,
    otp,
  }
}
