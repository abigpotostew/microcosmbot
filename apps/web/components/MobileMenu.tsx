// SPDX-License-Identifier: GPL-3.0-or-later

import Link from 'next/link'
import { ConnectKitButton } from 'connectkit'
import { useRecoilState } from 'recoil'
import { mobileMenuState as mobileMenuInitState } from 'state/MobileMenu'
import { NAV_LINKS } from 'constants/navLinks'

const MobileMenu: React.FC = () => {
  const [mobileMenuState, setMobileMenuState] =
    useRecoilState(mobileMenuInitState)

  if (!mobileMenuState.mobileMenuIsOpened) {
    return null
  }

  const closeMobileMenu = () => {
    setMobileMenuState((prev) => {
      return {
        ...prev,
        mobileMenuIsOpened: false,
      }
    })
  }

  return (
    <div className="bg-olive-200 border-b border-olive-500 p-7">
      <nav aria-label="Global">
        <ul className="flex flex-col w-full gap-10px">
          {NAV_LINKS.map((l) => (
            <li key={l.url}>
              <Link
                href={l.url}
                className="menu-item"
                onClick={closeMobileMenu}
              >
                {l.icon}
                <span className="text-body4 font-medium capitalize">
                  {l.name}
                </span>
              </Link>
            </li>
          ))}
          <li className="flex justify-center">
            <ConnectKitButton theme="nouns" label="Connect" />
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default MobileMenu
