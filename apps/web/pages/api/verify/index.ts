// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Secp256k1, Secp256k1Signature, sha256 } from '@cosmjs/crypto'
import { fromBase64, toUtf8 } from '@cosmjs/encoding'
import { decodeSignature } from '@cosmjs/amino'
import { Bech32Address, verifyADR36Amino } from '@keplr-wallet/cosmos'
import { StdSignature, StdSignDoc } from 'cosmwasm'
import { buildMessage } from 'libs/verify/build-mesage'

function sortedObject(obj: any): any {
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  if (Array.isArray(obj)) {
    return obj.map(sortedObject)
  }
  const sortedKeys = Object.keys(obj).sort()
  const result: Record<string, any> = {}
  // NOTE: Use forEach instead of reduce for performance with large objects eg Wasm code
  sortedKeys.forEach((key) => {
    result[key] = sortedObject(obj[key])
  })
  return result
}

export function sortedJsonStringify(obj: any): string {
  return JSON.stringify(sortedObject(obj))
}

export function serializeSignDoc(signDoc: StdSignDoc): Uint8Array {
  return toUtf8(sortedJsonStringify(signDoc))
}

export interface SignatureVerify {
  otp: string
}

export interface SignArbitraryVerification extends SignatureVerify {
  signature: StdSignature
  address: string
  otp: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(404).json({ message: 'not found' })
    return
  }

  let { strategy } = req.body
  strategy = strategy || 'SIGNAMINO'

  const { signature, address, otp } = req.body as SignArbitraryVerification
  const { pubkey: decodedPubKey, signature: decodedSignature } =
    decodeSignature(signature)
  const data = JSON.stringify(buildMessage(otp))
  const chainPrefix = Bech32Address.defaultBech32Config('stars')
  // https://github.com/wgwz/simple-express-keplr-passport/pull/2
  const verified = verifyADR36Amino(
    chainPrefix.bech32PrefixAccAddr,
    address,
    data,
    decodedPubKey,
    decodedSignature
  )

  if (!verified) {
    res.status(403).json({ message: 'forbidden' })
    return
  }

  try {
    //todo store the thing in the db
    // await stores().user.createIfNeeded(resolveAddress)
  } catch (e) {
    console.error(e)
    throw e
  }

  // issueToCookie(resolveAddress, req, res)
  //return success message
  res.status(200).json({ message: 'ok' })
}

const isValidSignature = async (
  signed: any,
  signature: any,
  publicKey: any
) => {
  let valid = false
  try {
    const binaryHashSigned = sha256(serializeSignDoc(signed))

    const binaryPublicKey = new Uint8Array(Object.values(publicKey))

    valid = await Secp256k1.verifySignature(
      Secp256k1Signature.fromFixedLength(fromBase64(signature)),
      binaryHashSigned,
      binaryPublicKey
    )
  } catch (e) {
    console.error('Issue trying to verify the signature', e)
  }
  return valid
}

// Returns boolean whether the user signed the right thing
const isCorrectOtp = async (expectedOtp: string, signed: any) => {
  let isCorrect = false
  try {
    // What they signed
    const signedSaganism = signed.msgs[0].value
    // What they should have signed
    const assignedSaganism = 'Magic, please!' + ' ' + expectedOtp
    isCorrect = signedSaganism === assignedSaganism
  } catch (e) {
    console.error('Issue determining if the user signed the right thing', e)
  }
  return isCorrect
}
