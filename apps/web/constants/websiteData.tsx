import { WebsiteData } from 'libs/types'

import PublicGood from 'public/icons/pubic-good.svg'
import OpenOnChain from 'public/icons/open-on-chain.svg'
import Composable from 'public/icons/composable.svg'
import WTFImageSrc from 'public/images/wtf-image.png'
import HeroImageSrc from 'public/images/hero-image.png'
import ProcessImageSrc from 'public/images/form-process-image.png'
import Logo from 'public/icons/logo.svg'
import { wtfList } from './wtf'

export const websiteData: WebsiteData = {
  logo: <Logo className="w-20" />,
  heroSection: {
    imageSrc: HeroImageSrc,
    processImageSrc: ProcessImageSrc,
  },
  benefitsSection: {
    benefits: [
      {
        title: 'Public Good',
        description: 'No fee or hidden charges, ever',
        icon: <PublicGood className="w-full" />,
      },
      {
        title: 'Open & On-chain',
        description: '100% open-source and no dependance on web2 services',
        icon: <OpenOnChain className="w-full" />,
      },
      {
        title: 'Composable',
        description:
          'Each payout agreement is a payable address to send/receive ETH & ERC-20',
        icon: <Composable className="w-full" />,
      },
    ],
  },
  wtfSection: {
    title: 'WTF?',
    subtitle:
      'Nouns Stream is a public good for payments across ⌐◨-◨-ish DAOs and beyond.',
    text: `Nouns Stream enables milestone-based or recurring payments. This public good can be used to support various modes of payments, including peer-to-peer, DAO-to-DAO, community rounds and grants. 
    
    Learn more below, or start by creating a new payment stream.`,
    imageSrc: WTFImageSrc,
    wtfList,
  },
  payoutSection: {
    title: 'Payouts',
    subtitle: 'Most recent streams for payouts',
  },
  verifySection: {
    title: 'Verify Wallet',
    subtitle: 'Verify your wallet to join a group',
  },
  manageSection: {
    title: 'Manage Group',
    subtitle: 'Configure your telegram group access',
  },
}
