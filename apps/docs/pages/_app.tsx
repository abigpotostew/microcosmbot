// SPDX-License-Identifier: GPL-3.0-or-later

import 'focus-visible'
import '@nouns-stream/ui/styles.css'
import 'styles/globals.css'

import React from 'react'
import type { AppProps } from 'next/app'
import { slugifyWithCounter } from '@sindresorhus/slugify'
import { Layout } from 'components/Layout'
import { Roboto, Londrina_Solid } from '@next/font/google'
import classNames from 'classnames'
import { PageSEO } from 'components/SEO'
import { websiteMetadata } from 'constants/index'
import { RecoilRoot } from 'recoil'

function getNodeText(node: any) {
  let text = ''
  for (let child of node.children ?? []) {
    if (typeof child === 'string') {
      text += child
    }
    text += getNodeText(child)
  }
  return text
}

function collectHeadings(nodes: any[], slugify = slugifyWithCounter()): any {
  let sections = []

  for (let node of nodes) {
    if (node.name === 'h2' || node.name === 'h3') {
      let title = getNodeText(node)
      if (title) {
        let id = slugify(title)
        node.attributes.id = id
        if (node.name === 'h3') {
          if (!sections[sections.length - 1]) {
            throw new Error(
              'Cannot add `h3` to table of contents without a preceding `h2`'
            )
          }
          sections[sections.length - 1].children.push({
            ...node.attributes,
            title,
          })
        } else {
          sections.push({ ...node.attributes, title, children: [] })
        }
      }
    }

    sections.push(...collectHeadings(node.children ?? [], slugify))
  }

  return sections
}

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
})
const londrina = Londrina_Solid({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-londrina',
})

export default function MyApp({ Component, pageProps }: AppProps) {
  let title = pageProps.markdoc?.frontmatter.title

  let pageTitle =
    pageProps.markdoc?.frontmatter.pageTitle ||
    `${pageProps.markdoc?.frontmatter.title} - Docs`

  let description = pageProps.markdoc?.frontmatter.description

  let tableOfContents = pageProps.markdoc?.content
    ? collectHeadings(pageProps.markdoc.content)
    : []

  return (
    <>
      <PageSEO
        title={`${websiteMetadata.title} | ${pageTitle}`}
        description={description || websiteMetadata.description}
      />
      <RecoilRoot>
        <main className={
          classNames(
            `${roboto.variable} font-sans`,
            `${londrina.variable} font-serif`
          )
        }>
          <Layout
            title={title}
            tableOfContents={tableOfContents}
            
          >
            <Component {...pageProps} />
          </Layout>
        </main>
      </RecoilRoot>
    </>
  )
}
