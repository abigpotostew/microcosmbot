import { createContext, ReactNode, useState, useEffect } from 'react'
import { useChain } from '@cosmos-kit/react'
import { SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate'
import { SigningStargateClient } from '@cosmjs/stargate'
import { WalletData } from 'client/core/wallet'
import { SignAminoFn } from 'libs/verify/keplr'
import { WalletStatus } from '@cosmos-kit/core'

// Wallet context

// The wallet context provides wallet information (name, address) and signing clients to the app,
// to sign transactions and communicate directly with Stargate or CosmWasm contracts.

// OfflineSigner allows the signing of simple wallet transactions like the transfer of funds.
// SigningCosmWasmClient allows execution of CosmWasm contracts like when minting an NFT.
// SigningStargateClient allows communication with the Cosmos SDK (used when emitting cosmos messages like delegation or voting).

export interface WalletContext {
  connect: () => void
  disconnect: () => void
  refreshBalance: () => void
  signingCosmWasmClient?: SigningCosmWasmClient
  signingStargateClient?: SigningStargateClient
  wallet?: WalletData
  signAmino?: SignAminoFn
  status: WalletStatus
  getAccount: () => Promise<WalletData | undefined>
}

export const Wallet = createContext<WalletContext>({
  connect: () => {},
  disconnect: () => {},
  refreshBalance: () => {},
  signingCosmWasmClient: undefined,
  signingStargateClient: undefined,
  wallet: undefined,
  signAmino: undefined,
  status: WalletStatus.Disconnected,
  getAccount: async () => undefined,
})

export const WalletProvider = ({
  children,
  chainName,
}: {
  children: ReactNode
  chainName: string
}) => {
  // Current wallet data
  const [wallet, setWallet] = useState<WalletData>()
  const [signingCosmWasmClient, setSigningCosmWasmClient] =
    useState<SigningCosmWasmClient>()
  const [signingStargateClient, setSigningStargateClient] =
    useState<SigningStargateClient>()

  const [refreshCounter, setRefreshCounter] = useState<number>(0)

  console.log('WalletProvider', chainName)
  const {
    connect: connectWallet,
    disconnect: disconnectWallet,
    wallet: connectedWallet,
    address: walletAddress,
    getSigningCosmWasmClient,
    getSigningStargateClient,
    signAmino,
    getAccount,
    status,
    chain,
  } = useChain(chainName)

  const refreshBalance = () => {
    setRefreshCounter(refreshCounter + 1)
  }

  // Refresh the wallet's balance when the refresh counter is incremented
  useEffect(() => {
    async function effect() {
      if (connectedWallet && walletAddress && signingCosmWasmClient) {
        setWallet({
          address: walletAddress,
          name: connectedWallet.name,
        })
      }
    }
    effect()
  }, [refreshCounter, chain.chain_id])

  // When connectedWallet changes, we extract the info we need and save it to `wallet`.
  // If it's become `null`, we also set `wallet` to `null`.
  useEffect(() => {
    async function effect() {
      if (connectedWallet && walletAddress) {
        const signingCosmWasmClient = await getSigningCosmWasmClient()
        const signingStargateClient = await getSigningStargateClient()

        // Set the wallet data
        setWallet({
          address: walletAddress,
          name: connectedWallet.name,
        })

        // Get all other signers
        // They are state vars so that when they are updated StargazeClient is also udpated
        setSigningCosmWasmClient(signingCosmWasmClient)
        setSigningStargateClient(signingStargateClient)
      } else {
        // No wallet = no data
        setWallet(undefined)
        setSigningCosmWasmClient(undefined)
        setSigningStargateClient(undefined)
      }
    }
    effect()
  }, [connectedWallet, walletAddress])

  const connect = () => {
    connectWallet()
  }
  const disconnect = () => {
    disconnectWallet()
  }

  return (
    <Wallet.Provider
      value={{
        connect,
        disconnect,
        refreshBalance,
        signingCosmWasmClient,
        signingStargateClient,
        wallet,
        signAmino,
        status,
        getAccount,
      }}
    >
      {children}
    </Wallet.Provider>
  )
}
