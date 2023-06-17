// SPDX-License-Identifier: GPL-3.0-or-later

import Link from 'next/link'
import { ConnectKitButton } from 'connectkit'
import { NAV_LINKS, websiteData } from 'constants/index'
import { useRecoilState } from 'recoil'
import { mobileMenuState as mobileMenuInitState } from 'state/MobileMenu'
import classNames from 'classnames'
import CloseIcon from 'public/icons/close-icon.svg'
import MenuIcon from 'public/icons/menu-icon.svg'

const Header: React.FC = () => {
  const [mobileMenuState, setMobileMenuState] =
    useRecoilState(mobileMenuInitState)

  const toggleMobileMenu = () => {
    setMobileMenuState((prev) => {
      return {
        ...prev,
        mobileMenuIsOpened: !prev.mobileMenuIsOpened,
      }
    })
  }

  return (
    <header className="w-full z-10 bg-olive-200">
      <div className="container flex items-center justify-between gap-2 px-6 py-5 xl:py-6">
        <div className="flex items-center gap-5 xl:gap-6">
          <Link href={'/'} className="w-20">
            {websiteData.logo}
          </Link>
        </div>
        {/*<nav className="hidden lg:flex xl:flex" aria-label="Global">*/}
        {/*  <ul className="flex items-center gap-3">*/}
        {/*    {NAV_LINKS.map((l) => (*/}
        {/*      <li key={l.name}>*/}
        {/*        <Link href={l.url} className="menu-item">*/}
        {/*          {l.icon}*/}
        {/*          <span className="text-body4 font-medium capitalize">*/}
        {/*            {l.name}*/}
        {/*          </span>*/}
        {/*        </Link>*/}
        {/*      </li>*/}
        {/*    ))}*/}
        {/*    <li>*/}
        {/*      <ConnectKitButton theme="nouns" label="Connect" />*/}
        {/*    </li>*/}
        {/*  </ul>*/}
        {/*</nav>*/}
        <button
          className={classNames(
            'inline-flex w-10 h-10 items-center justify-center transition-colors rounded-lx border border-olive-500 focus:outline-none lg:hidden xl:hidden',
            mobileMenuState.mobileMenuIsOpened ? 'bg-olive-400' : ''
          )}
          onClick={toggleMobileMenu}
        >
          {mobileMenuState.mobileMenuIsOpened ? (
            <CloseIcon className="w-5 h-5" />
          ) : (
            <MenuIcon className="w-full h-full" />
          )}
        </button>
      </div>
    </header>
  )
}

export default Header
