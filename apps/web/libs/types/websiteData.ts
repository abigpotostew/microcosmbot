import { StaticImageData } from 'next/image'
import { FunctionComponent } from 'react'

export interface WTFList {
  title: string
  text: string | JSX.Element
  video?: JSX.Element
}

export interface IBenefitItem {
  icon: JSX.Element
  title: string
  description: string
}

export interface WebsiteData {
  logo: JSX.Element
  logoUrl: string
  heroSection: {
    imageSrc: StaticImageData
    processImageSrc: StaticImageData
  }
  benefitsSection: {
    benefits: IBenefitItem[]
  }
  wtfSection: {
    title: string
    subtitle: string
    text: string
    imageSrc: StaticImageData
    wtfList: WTFList[]
  }
  payoutSection: {
    title: string
    subtitle: string
  }
  verifySection: {
    title: string
    subtitle: string
  }
  manageSection: {
    title: string
    subtitle: string
  }
}
