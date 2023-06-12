import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Navigation } from 'components/Navigation'
import { Icon } from './Icon'
import classNames from 'classnames'
import { NAV_LINKS } from './Layout'
import { useRecoilState } from 'recoil'
import { mobileMenuState as mobileMenuInitState } from 'state/MobileMenu'

import Logo from "public/icons/logo-white.svg"

function CloseIcon(props: any) {
  return (
    <Icon icon="close" size={[28, 28]} className="w-10 h-10 fill-gray-900 dark:fill-olive-200" color="inherit" />
  )
}

export function MobileNavigation({ navigation }: any) {
  let router = useRouter()
  const [mobileMenuState, setMobileMenuState] =
    useRecoilState(mobileMenuInitState)

  useEffect(() => {
    if (!mobileMenuState.mobileMenuIsOpened) return

    router.events.on('routeChangeComplete', closeMobileMenu)
    router.events.on('routeChangeError', closeMobileMenu)

    return () => {
      router.events.off('routeChangeComplete', closeMobileMenu)
      router.events.off('routeChangeError', closeMobileMenu)
    }
  }, [mobileMenuState.mobileMenuIsOpened, router])

  const closeMobileMenu = () => {
    setMobileMenuState((prev) => {
      return {
        ...prev,
        mobileMenuIsOpened: false,
      }
    })
  }

  if (!mobileMenuState.mobileMenuIsOpened) {
    return null
  }

  return (
    <>
      {mobileMenuState.mobileMenuIsOpened ? (
        <style jsx global>{`
          body {
            overflow: hidden;
          }
        `}</style>
      ) : null}

      <div
        className="fixed inset-0 z-50 flex items-start overflow-y-auto bg-olive-100 dark:bg-olive-900 lg:hidden"
        aria-label="Navigation"
      >
        <div className="min-h-full w-full max-w-full bg-olive-100 py-5 px-6 dark:bg-olive-900">
          <div className="container max-w-docs-desktop flex items-center justify-between gap-4">
            <Link href={'/'}>
              <Logo className="w-20 flex-shrink-0" />
            </Link>
            <button
              type="button"
              onClick={closeMobileMenu}
              aria-label="Close navigation"
            >
              <CloseIcon />
            </button>
          </div>
          <nav aria-label="Menu items">
            <ul className="flex flex-col gap-5 py-8 mb-8 w-full border-b border-olive-700 sm:flex-row sm:gap-6">
              {NAV_LINKS.map((l) => {
                const Icon = l.icon
                return (
                  <li key={l.name}>
                    <Link href={l.url} className={classNames("menu-item group", l.name === 'Documentation' ? 'bg-olive-500' : '')}>
                      <Icon className={classNames("w-5 fill-gray-900 dark:fill-white transition-colors group-hover:fill-white dark:group-hover:fill-gray-900", l.name === 'Documentation' ? 'fill-white dark:fill-gray-900' : '')} color="inherit" />
                      <span className={classNames("text-body3 capitalize transition-colors text-gray-900 group-hover:text-white dark:text-white dark:group-hover:text-gray-900", l.name === 'Documentation' ? 'text-white dark:text-gray-900 ' : '')}>{l.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
          <Navigation navigation={navigation} className="mt-11" />
        </div>
      </div>
    </>
  )
}
