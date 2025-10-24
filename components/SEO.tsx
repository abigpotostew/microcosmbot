// SPDX-License-Identifier: GPL-3.0-or-later

import Head from 'next/head'
import { useRouter } from 'next/router'
import { websiteMetadata } from 'constants/index'
import { BasicSEOProps, CommonSEOProps } from 'libs/types/seoHeadProps'

const CommonSEO: React.FC<CommonSEOProps> = ({
  title,
  description,
  ogType,
  ogImage,
  twImage,
}) => {
  const router = useRouter()

  return (
    <Head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="follow, index" />
      <meta name="description" content={description} />
      <meta
        property="og:url"
        content={`${websiteMetadata.siteUrl}${router.asPath}`}
      />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={websiteMetadata.title} />
      <meta property="og:description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:image" content={ogImage} key={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={twImage} />
    </Head>
  )
}

export const PageSEO: React.FC<BasicSEOProps> = ({ title, description }) => {
  return (
    <CommonSEO
      title={title}
      description={description}
      ogType="website"
      ogImage={websiteMetadata.socialBanner}
      twImage={websiteMetadata.socialBanner}
    />
  )
}
