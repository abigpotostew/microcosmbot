import { Group, GroupTokenGate, Wallet } from '@microcosms/db'
import { LogContext, tinyAsyncPoolAll } from '../../utils'
import { Pointer } from '../../utils/pointer'
import { getOwnedCount } from '../token-ownership/nft-ownership'
function shuffle<T>(array: Array<T>) {
  let currentIndex = array.length,
    randomIndex

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }

  return array
}
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
    ruleType: tokenGate.ruleType,
    denom: tokenGate.tokenFactoryDenom,
    exponent: tokenGate.tokenFactoryExponent,
    owner: address,
    useRemoteCache,
    chainId: group.chainId,
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

  //todo abort signal if wallet is found
  await tinyAsyncPoolAll(wallets, async (wallet) => {
    if (foundWallet.value) {
      return
    }
    // use OR logic if true, AND logic if false
    const allowMatchAnyRule = group.allowMatchAnyRule
    let matchedAnyRule = false

    for (const groupTokenGateElement of group.groupTokenGate) {
      const passesRule = await verifyWalletAgainstAccessRule(
        {
          address: wallet.address,
          group,
          tokenGate: groupTokenGateElement,
        },
        { useRemoteCache }
      )
      // if the rule is true and we are using OR logic, we can short circuit here
      if (passesRule && allowMatchAnyRule) {
        matchedAnyRule = true
        break
      }
      // if the rule is false and we are using AND logic, we can stop here
      if (!passesRule && !allowMatchAnyRule) {
        cl.log('wallet not allowed for rule', groupTokenGateElement)
        return
      }
    }
    if (allowMatchAnyRule && matchedAnyRule) {
      //they qualify for at least one rule
      foundWallet.value = wallet
    } else if (!allowMatchAnyRule) {
      //they qualify for all rules
      foundWallet.value = wallet
    }
  })
  return foundWallet.value
}
