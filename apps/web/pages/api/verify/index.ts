// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Secp256k1, Secp256k1Signature, sha256 } from '@cosmjs/crypto'
import { fromBase64, toUtf8 } from '@cosmjs/encoding'
import { decodeSignature } from '@cosmjs/amino'
import { Bech32Address, verifyADR36Amino } from '@keplr-wallet/cosmos'
import { AccountData, StdSignature, StdSignDoc } from 'cosmwasm'
import { buildMessage } from 'libs/verify/build-mesage'
import { verifyWalletWithOtp } from '@microcosms/bot'
import { prismaClient } from '@microcosms/db'

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
export interface SignAminoVerification extends SignatureVerify {
  signature: StdSignature
  signed: StdSignDoc
  account: AccountData
  otp: string
}
const setResponse = (res: NextApiResponse) => (status: number, body: any) => {
  res.status(status).json(body)
}
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(404).json({ message: 'not found' })
    return
  }

  console.log('here')
  let { strategy } = req.body
  strategy = strategy || 'SIGNAMINO'

  const date = new Date()

  let resolveAddress: string
  let verified: boolean | 'unauthorized' = false
  const { otp } = req.body
  if (!otp) {
    res.status(401).json({ message: 'unauthorized' })
    return
  }
  if (strategy === 'SIGNAMINO') {
    const { signed, signature, account, otp } =
      req.body as SignAminoVerification
    const publicKey = account.pubkey
    const valid = await isValidSignature(signed, signature, publicKey)
    if (!valid) {
      verified = 'unauthorized'
      resolveAddress = account.address
    } else {
      verified = await isCorrectOtp(otp, signed)
      resolveAddress = account.address
    }
  } else {
    const { signature, address, otp } = req.body as SignArbitraryVerification
    const { pubkey: decodedPubKey, signature: decodedSignature } =
      decodeSignature(signature)
    const data = JSON.stringify(buildMessage(otp))
    const chainPrefix = Bech32Address.defaultBech32Config('stars')
    // https://github.com/wgwz/simple-express-keplr-passport/pull/2
    verified = verifyADR36Amino(
      chainPrefix.bech32PrefixAccAddr,
      address,
      data,
      decodedPubKey,
      decodedSignature
    )
    resolveAddress = address
  }

  if (!verified || verified === 'unauthorized') {
    let status = 401
    if (verified === 'unauthorized') {
      res.status(401).json({ message: 'unauthorized' })
    } else {
      status = 403
      res.status(403).json({ message: 'forbidden' })
    }
    await prismaClient().auditLog.create({
      data: {
        auditType: 'VERIFY_ATTEMPT',
        data: { strategy, resolveAddress, verified, status },
        updateDate: date,
      },
    })
    return
  }

  try {
    let status: number = 200
    const setResponseWrapped = (res: NextApiResponse) => {
      const fn = setResponse(res)
      return (_status: number, body: any) => {
        status = _status
        fn(_status, body)
      }
    }
    await verifyWalletWithOtp({
      otp,
      setStatus: setResponseWrapped(res),
      resolveAddress,
      overwrite: req.query.overwrite === 'true',
    })
    await prismaClient().auditLog.create({
      data: {
        auditType: 'VERIFY_ATTEMPT',
        data: { strategy, resolveAddress, verified, status },
        updateDate: date,
      },
    })
  } catch (e) {
    console.error('unknown', e)
    res.status(500).json({ message: 'unknown' })
    return
  }
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
      Secp256k1Signature.fromFixedLength(fromBase64(signature.signature)),
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
    const assignedSaganism = JSON.stringify(buildMessage(expectedOtp))
    isCorrect = signedSaganism === assignedSaganism
  } catch (e) {
    console.error('Issue determining if the user signed the right thing', e)
  }
  return isCorrect
}
