// SPDX-License-Identifier: GPL-3.0-or-later

import { Icon } from 'components/Icon'
import { useRouter } from 'next/router'

const ProtocolDisclaimer: React.FC = () => {
  const router = useRouter()
  const handleBack = () => router.back()

  return (
    <section className="relative pb-10 xl:pb-24">
      <header className="relative z-50 bg-olive-200 pt-16 pb-8 lg:pb-9">
        <div className="container px-6">
          <div className="flex flex-col items-start gap-4">
            <h1 className="text-title2">Protocol Disclaimer</h1>
            <button
              onClick={handleBack}
              className="text-body1 inline-flex items-center gap-3 group"
            >
              <Icon
                icon="arrow"
                classes="w-5 h-5 origin-center shrink-0 fill-gray-900 rotate-180 transition-transform group-hover:-translate-x-1"
                color="inherit"
              />
              Back
            </button>
          </div>
        </div>
      </header>
      <div className="container flex flex-col items-start gap-6 pt-22 px-6">
        <p className="text-body1">
          Nouns Stream is a decentralized peer-to-peer protocol that people can
          use to create smart contracts. The protocol is made up of free,
          public, open-source or source-available software including a set of
          smart contracts that are deployed on, among others, the Ethereum
          blockchain. Your use of the Nouns Stream protocol involves various
          risks, including, but not limited to, losses while digital assets are
          being held in the protocol smart contracts. Before using the Nouns
          Stream protocol, you should review the relevant documentation to make
          sure you understand how the Nouns Stream protocol works. Additionally,
          you can access the Nouns Stream protocol through multiple web or
          mobile interfaces, and you are responsible for doing your own
          diligence on those interfaces to understand the fees and risks they
          present.
        </p>
        <p className="text-body1">
          The Nouns Stream protocol is provided “as is”, at your own risk, and
          without warranties of any kind. Although Wardenclyffe Labs Inc.
          developed much of the initial code for the Nouns Stream protocol, it
          does not provide, own, or control the Nouns Stream protocol, which is
          run by smart contracts deployed on, among others, the Ethereum
          blockchain. No developer or entity involved in creating the Nouns
          Stream protocol will be liable for any claims or damages whatsoever
          associated with your use, inability to use, or your interaction with
          other users of, the Nouns Stream protocol, including any direct,
          indirect, incidental, special, exemplary, punitive or consequential
          damages, or loss of profits, cryptocurrencies, tokens, or anything
          else of value.
        </p>
      </div>
    </section>
  )
}

export default ProtocolDisclaimer
