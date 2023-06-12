import { WTFList } from 'libs/types'
import Link from 'next/link'

const auditUrl = 'https://github.com/daokitchen/nouns-stream/tree/main/audit'

export const wtfList: WTFList[] = [
  {
    title: 'How does this work?',
    text: `When you set up a milestone-based (i.e., Phased) or recurring (Periodic) payment, a new contract is deployed for the given configuration. These contracts support both ETH and ERC-20 payments. The newly deployed contract has the payouts coded as you had set up in the form (or via Developer SDK). The Controller address provided during setup can only pause or cancel this new contract. 
    
    Nouns Stream aims to be a push protocol such that if you add a Tip (greater than 0.1% of the total amount), bots can push the payouts directly to the Recipient's address instead of them having to come back and claim every due date. But, of course, the protocol can operate without tip as well, in which case, the Recipient has to visit the page for a given stream and withdraw funds as they become available. You can see and search through a list of all streams deployed via Explorer.
    
    We leverage CREATE2 so you can deterministically know the address of the future contract as long as the configuration for a given stream remains the same. Sometimes, this might be useful for governance contracts. Check out the recipe for this use case in our documentation.`,
  },
  {
    title: 'Are my funds safe?',
    text: <>The contracts have been audited by {<Link href={auditUrl} target="_black" className="font-medium">0xMacro</Link>}. Moreover, each new stream is set up as its own contract as outlined above, and this newly deployed contract is fully controlled by the configured Controller address. The developers of Nouns Stream, Nouns DAO or any other third party do not have access or control over funds in the deployed contract. However, the developers of Nouns Stream assume no responsibility. Please read the Protocol Disclaimer and Terms of Service at the bottom of the website.</>,
  },
  {
    title: 'Can I use this outside Nouns?',
    text: `Nouns Stream can be used for all use cases of milestone-based (i.e., Phased) or recurring (i.e., Periodic) payments of ETH or ERC-20 tokens. The only requirement is that the Recipient has an Ethereum address. The Controller address can be an EOA or smart contract. The smart contract can or cannot be controlled by any given governance mechanism, e.g., Nouns or Compound Governance. Nouns Stream doesn't make any assumptions or enforce restrictions. Therefore, the public good can be used for peer-to-peer as much as DAO-to-DAO payments or Community Grants and Fellowship Rewards.
    
    Nouns Stream also makes it easy to deploy via multi-sig as it provides deterministic addresses for set configurations.
    
    Developers can also use Nouns Stream within their protocols and dApps through the SDK without having to go through an audit to redeploy the same contracts. This opens the infrastructure to many use cases we have not even imagined.`,
  },
  {
    title: 'What is the Developer SDK?',
    text: `The Developer SDK for Nouns Stream is a React package available on NPM. It contains helper methods, types, and functions for developers of React applications to easily integrate Nouns Stream into their projects without having to go through audit and redeployment. In addition, Nouns Stream contracts are optimized for gas efficiency, and this SDK contains all the methods needed to create, pause and cancel streams. Fund withdrawal and contract metadata functions are also available in the SDK.`,
  },
  {
    title: 'Who has built Nouns Stream?',
    text: `Nouns Stream is built as a free, open-source, and composable public good by Noun#436 and Noun#604. There are no immediate plans for a DAO. Nouns Stream is a public good; hence it will never have a token. The audit fee was paid by Nouns DAO via proposal#[tbd].`,
  },
]
