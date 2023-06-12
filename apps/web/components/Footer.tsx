// SPDX-License-Identifier: GPL-3.0-or-later

import Link from 'next/link'
import FooterBg from 'public/icons/footer-bg.svg'
import FrameBlock from './FrameBlock'
import { FOOTER_LINKS, websiteData } from 'constants/index'

const Footer: React.FC = () => (
  <footer className="relative pb-20 overflow-hidden">
    <div className="container px-6">
      <FrameBlock classes="py-6 px-5 xl:py-6 ml:px-10 bg-white">
        <div className="flex flex-col justify-between items-start md:flex-row md:gap-10">
          <Link href={'/'} className="mb-8">
            {websiteData.logo}
          </Link>
          <nav className="flex flex-wrap w-full items-start gap-16 md:w-128 md:justify-between md:flex-nowrap lg:w-144 xl:gap-0 xl:pr-9">
            {FOOTER_LINKS.map((t, i) => (
              <div
                key={`${t.type}-${i}`}
                className="flex flex-col gap-4 items-start"
              >
                <h4 className="text-title4 capitalize">{t.type}</h4>
                <ul className="flex flex-col gap-3 items-start">
                  {t.links.map((l, i) => {
                    return (
                      <Link
                        key={`l-${i}`}
                        href={l.url}
                        target={l.external ? '_blank' : undefined}
                        className="text-body3 font-normal capitalize"
                      >
                        {l.name}
                      </Link>
                    )
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-4 justify-between border-t border-gray-200 pt-6 mt-8 md:gap-0 md:flex-row xl:pr-9">
          <span className="text-body3 text-xs text-gray-300 md:text-sm">
            A nounish public good by Wardenclyffe Labs Inc.
          </span>
          <div className="flex gap-16 xl:gap-28">
            <Link
              href={'/terms-of-service'}
              className="text-body3 text-xs text-gray-300 transition-colors hover:text-gray-900 md:text-sm"
            >
              Terms of Service
            </Link>
            <Link
              href={'/protocol-disclaimer'}
              className="text-body3 text-xs text-gray-300 transition-colors hover:text-gray-900 md:text-sm"
            >
              Protocol Disclaimer
            </Link>
          </div>
        </div>
      </FrameBlock>
    </div>
    <FooterBg className="absolute bottom-0 left-0 w-300 lg:w-full pointer-events-none" />
  </footer>
)

export default Footer
