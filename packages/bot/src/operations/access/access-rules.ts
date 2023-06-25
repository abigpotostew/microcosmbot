import { Group, GroupTokenGate, Wallet } from '@microcosms/db'
import { LogContext, tinyAsyncPoolAll } from '../../utils'
import { Pointer } from '../../utils/pointer'
import { getOwnedCount } from '../token-ownership/nft-ownership'

export const verifyWalletAgainstAccessRule = async (
  {
    address,
    group,
    tokenGate,
  }: {
    address: string
    group: Group
    tokenGate: GroupTokenGate
  },
  { useRemoteCache = false }: { useRemoteCache?: boolean } = {}
) => {
  const min = tokenGate.minTokens || 1
  const max = tokenGate.maxTokens
  const hasValidOwnedCount = (ownedCount: number) => {
    if (max) {
      return ownedCount >= min && ownedCount <= max
    }
    return ownedCount >= min
  }
  const ownedCount = await getOwnedCount({
    contractAddress: tokenGate.contractAddress,
    owner: address,
    useRemoteCache,
  })

  return hasValidOwnedCount(ownedCount)
}
export const checkAccessRules = async (
  cl: LogContext,
  group: Group & { groupTokenGate: GroupTokenGate[] },
  wallets: Wallet[],
  { useRemoteCache = false }: { useRemoteCache?: boolean } = {}
): Promise<Wallet | null> => {
  const foundWallet: Pointer<Wallet | null> = new Pointer(null)
  await tinyAsyncPoolAll(wallets, async (wallet) => {
    if (foundWallet.value) {
      return
    }
    for (const groupTokenGateElement of group.groupTokenGate) {
      if (
        !(await verifyWalletAgainstAccessRule(
          {
            address: wallet.address,
            group,
            tokenGate: groupTokenGateElement,
          },
          { useRemoteCache }
        ))
      ) {
        cl.log('wallet not allowed for rule', groupTokenGateElement)
        return
      }
    }
    //they qualify for all rules
    foundWallet.value = wallet
  })
  return foundWallet.value
}
