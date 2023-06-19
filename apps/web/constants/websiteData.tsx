import { WebsiteData } from 'libs/types'

import PublicGood from 'public/icons/pubic-good.svg'
import OpenOnChain from 'public/icons/open-on-chain.svg'
import Composable from 'public/icons/composable.svg'
import WTFImageSrc from 'public/images/wtf-image.png'
// import HeroImageSrc from 'assets/images/hero.jpg'
import HeroImageSrc from 'assets/images/hero.png'
import ProcessImageSrc from 'public/images/form-process-image.png'
import Logo from 'assets/icons/logo-larger.svg'
import { wtfList } from './wtf'
import { botInfo } from '@microcosms/bot/botinfo'

export const websiteData: WebsiteData = {
  logo: <Logo className="w-20" />,
  heroSection: {
    imageSrc: HeroImageSrc,
    processImageSrc: ProcessImageSrc,
  },
  benefitsSection: {
    benefits: [
      {
        title: 'Build your Community',
        description: 'Coalesce your holders in a telegram group.',
        icon: <PublicGood className="w-full" />,
      },
      {
        title: 'Composable',
        description: 'Create rules to customize who can join your group.',
        icon: <Composable className="w-full" />,
      },
      {
        title: 'Open Source',
        description: '100% open-source copy left license.',
        icon: <OpenOnChain className="w-full" />,
      },
    ],
  },
  wtfSection: {
    title: 'WTF?',
    subtitle:
      'MicroCosmBot is a telegram bot that enables token gated telegram groups with stargaze NFTs.',
    text: `Quickly and easily configure a bot to manage access based on NFT holdings.
    
    MicroCosmBot will periodically make sure group members still hold the required NFTs. If they don't, they will be removed from the group. 
    
    Learn more below, or start by creating a group and inviting @${botInfo.username}`,
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
