# Nouns Stream SDK

### Get Started

Install `nouns-stream` and your favorite web3 lib

```bash
yarn add @daokitchen/nouns-stream-sdk
yarn add wagmi
```

### Deploy Phases Stream

```typescript
import { useContract, useSigner } from 'wagmi'
import { addresses, Manager__factory } from '@daokitchen/nouns-stream-sdk'

const { data: signer } = useSigner()

// Initialize contract
const nounsStreamManager = useContract({
  address: addresses.goerli.ManagerProxy,
  abi: Manager__factory.abi,
  signerOrProvider: signer,
})

// Create phases stream
const tx = await nounsStreamManager.createMSStream(
  payer,
  msPayments, // Array of payments with index matched to timestamps index below
  msDates, // Array of unix timestamps
  tip, // Tip for bot to push payment
  recipient,
  token // Payment token
)

await tx.wait(1)
```

### Phases Stream Usage

```typescript
import { useContract, useSigner } from 'wagmi'
import { addresses, Stream__factory } from '@daokitchen/nouns-stream-sdk'

const { data: signer } = useSigner()

// Initialize contract
const stream = useContract({
  address: milestoneAddress, // Get from UI or previous manager create tx
  abi: Stream__factory.abi,
  signerOrProvider: signer,
})

// Release funds
await stream.claim()

//
// Workflow for mutual canceling of escrow retrieving funds from escrow
//
// Cancel, only controller, controller should be a multisig, to appropriately handle arbitration
await stream.pause()
// Withdraw, only controller (DAO)
await stream.withdraw()
```

### Change owners and recipient

```typescript
// Change controler, only owner can do
await stream.transferOwnership(newOwner)

// Change recipient, only recipient can do
await stream.changeRecipient(newRecipient)
```
