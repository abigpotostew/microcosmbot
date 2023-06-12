// SPDX-License-Identifier: GPL-3.0-or-later

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'
import { Hero } from 'components/Hero'
import { Navigation } from 'components/Navigation'
import { Prose } from 'components/Prose'
import Logo from 'public/icons/logo-white.svg'
import { Icon } from 'components/Icon'
import { useRecoilState } from 'recoil'
import { mobileMenuState as mobileMenuInitState } from 'state/MobileMenu'
import { MobileNavigation } from './MobileNavigation'

const nounsStreamUrl = 'https://nouns.stream/explorer'

export const NAV_LINKS = [
  {
    name: 'Explorer',
    url: `${nounsStreamUrl}/explorer`,
    icon: (props: any) => <Icon icon="explorer" size={[20, 20]} {...props} />,
  },
  {
    name: 'Documentation',
    url: '/',
    icon: (props: any) => <Icon icon="docs" size={[20, 20]} {...props} />,
  },
  {
    name: 'SDK',
    url: '/sdk',
    icon: (props: any) => <Icon icon="changelog" size={[20, 20]} {...props} />,
  },
  {
    name: 'Github',
    url: 'https://github.com/daokitchen/nouns-stream',
    icon: (props: any) => <Icon icon="github" size={[20, 20]} {...props} />,
  },
]

const navigation = [
  {
    title: 'Introduction',
    links: [
      { title: 'Getting started', href: '/' },
      { title: 'Installation', href: '/installation' },
    ],
  },
  {
    title: 'Core concepts',
    links: [
      { title: 'Understanding caching', href: '/understanding-caching' },
      {
        title: 'Predicting user behavior',
        href: '/predicting-user-behavior',
      },
      { title: 'Basics of time-travel', href: '/basics-of-time-travel' },
      {
        title: 'Introduction to string theory',
        href: '/introduction-to-string-theory',
      },
      { title: 'The butterfly effect', href: '/the-butterfly-effect' },
    ],
  },
  {
    title: 'Advanced guides',
    links: [
      { title: 'Writing plugins', href: '/writing-plugins' },
      { title: 'Neuralink integration', href: '/neuralink-integration' },
      { title: 'Temporal paradoxes', href: '/temporal-paradoxes' },
      { title: 'Testing', href: '/testing' },
      { title: 'Compile-time caching', href: '/compile-time-caching' },
      {
        title: 'Predictive data generation',
        href: '/predictive-data-generation',
      },
    ],
  },
  {
    title: 'API reference',
    links: [
      { title: 'CacheAdvance.predict()', href: '/cacheadvance-predict' },
      { title: 'CacheAdvance.flush()', href: '/cacheadvance-flush' },
      { title: 'CacheAdvance.revert()', href: '/cacheadvance-revert' },
      { title: 'CacheAdvance.regret()', href: '/cacheadvance-regret' },
    ],
  },
  {
    title: 'Contributing',
    links: [
      { title: 'How to contribute', href: '/how-to-contribute' },
      { title: 'Architecture guide', href: '/architecture-guide' },
      { title: 'Design principles', href: '/design-principles' },
    ],
  },
]

function Header() {
  const [mobileMenuState, setMobileMenuState] =
    useRecoilState(mobileMenuInitState)

  const openMobileMenu = () => {
    setMobileMenuState((prev) => {
      return {
        ...prev,
        mobileMenuIsOpened: true,
      }
    })
  }

  return (
    <header className="relative w-full z-10">
      <div className="container flex items-center justify-between gap-2 px-6 py-5 xl:py-6">
        <div className="flex items-center gap-5 xl:gap-6">
          <Link href={nounsStreamUrl} className="w-20">
            <Logo className="w-20" />
          </Link>
        </div>
        <nav className="hidden lg:flex" aria-label="Global">
          <ul className="flex items-center gap-3">
            {NAV_LINKS.map((l, i) => {
              const IconComponent = l.icon

              return (
                <li key={l.name}>
                  <Link
                    href={l.url}
                    className={clsx(
                      'menu-item group',
                      l.name === 'Documentation' ? 'bg-olive-500' : ''
                    )}
                  >
                    <IconComponent
                      className={clsx(
                        'h-5 w-5 transition-colors group-hover:fill-gray-900',
                        l.name === 'Documentation'
                          ? 'fill-gray-900'
                          : 'fill-white'
                      )}
                      color="inherit"
                    />
                    <span
                      className={clsx(
                        'text-body4 font-medium capitalize transition-colors group-hover:text-gray-900',
                        l.name === 'Documentation'
                          ? 'text-gray-900'
                          : 'text-white'
                      )}
                    >
                      {l.name}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <button
          type="button"
          onClick={openMobileMenu}
          className="relative flex lg:hidden"
          aria-label="Open navigation"
        >
          <Icon icon="burger" size={[32, 20]} className="w-8 h-5 fill-gray-900 dark:fill-olive-200" color="inherit" />
        </button>
      </div>
    </header>
  )
}

function useTableOfContents(tableOfContents: any) {
  let [currentSection, setCurrentSection] = useState(tableOfContents[0]?.id)

  let getHeadings = useCallback((tableOfContents: any) => {
    return tableOfContents
      .flatMap((node: any) => [
        node.id,
        ...node.children.map((child: any) => child.id),
      ])
      .map((id: any) => {
        let el = document.getElementById(id)
        if (!el) return

        let style = window.getComputedStyle(el)
        let scrollMt = parseFloat(style.scrollMarginTop)

        let top = window.scrollY + el.getBoundingClientRect().top - scrollMt
        return { id, top }
      })
  }, [])

  useEffect(() => {
    if (tableOfContents.length === 0) return
    let headings = getHeadings(tableOfContents)
    function onScroll() {
      let top = window.scrollY
      let current = headings[0].id
      for (let heading of headings) {
        if (top >= heading.top) {
          current = heading.id
        } else {
          break
        }
      }
      setCurrentSection(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [getHeadings, tableOfContents])

  return currentSection
}

export function Layout({ children, title, tableOfContents, classes }: any) {
  let router = useRouter()
  let isHomePage = router.pathname === '/'
  let allLinks = navigation.flatMap((section) => section.links)
  let linkIndex = allLinks.findIndex((link) => link.href === router.pathname)
  let previousPage = allLinks[linkIndex - 1]
  let nextPage = allLinks[linkIndex + 1]
  let section = navigation.find((section) =>
    section.links.find((link) => link.href === router.pathname)
  )
  let currentSection = useTableOfContents(tableOfContents)

  function isActive(section: any) {
    if (section.id === currentSection) {
      return true
    }
    if (!section.children) {
      return false
    }
    return section.children.findIndex(isActive) > -1
  }

  return (
    <>
      <Header />
      <MobileNavigation navigation={navigation} />

      {isHomePage && <Hero />}

      <div
        className={clsx(
          'relative mx-auto flex max-w-8xl justify-center sm:px-2 lg:px-8 xl:px-12',
          classes ?? ''
        )}
      >
        <div className="hidden lg:relative lg:block lg:flex-none">
          <div className="absolute top-0 bottom-0 right-0 w-px bg-olive-700" />
          <div className="sticky top-[4.5rem] -ml-0.5 h-[calc(100vh-4.5rem)] overflow-y-auto overflow-x-hidden py-16 pl-0.5">
            <Navigation
              navigation={navigation}
              className="w-64 pr-8 xl:w-72 xl:pr-16"
            />
          </div>
        </div>
        <div className="min-w-0 max-w-2xl flex-auto px-4 py-16 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16">
          <article>
            {(title || section) && (
              <header className="mb-7 flex flex-col gap-3">
                {section && (
                  <p className="text-label text-sm leading-4 text-yellow-300">
                    {section.title}
                  </p>
                )}
                {title && <h1 className="text-title1 text-white">{title}</h1>}
              </header>
            )}
            <Prose>{children}</Prose>
          </article>
          <dl className="mt-12 flex border-t pt-6 border-olive-700">
            {previousPage && (
              <div>
                <dt className="text-body4 font-bold tracking-body-text text-white">
                  Previous
                </dt>
                <dd className="mt-1">
                  <Link
                    href={previousPage.href}
                    className="text-body3 font-semibold text-amber-50 flex items-center gap-3px hover:text-yellow-300/70 group"
                  >
                    <span aria-hidden="true">
                      <svg
                        className="w-4 h-4 fill-amber-50 origin-center rotate-180 group-hover:fill-yellow-300/70"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.99336 7.58594H12.3934V9.18594H13.9934V7.58594H15.5934V9.18594H17.1934V10.7859H15.5934V12.3859H13.9934V10.7859H3.79336V7.58594H5.99336Z"
                          fill="inherit"
                        />
                        <path
                          d="M13.9932 5.98608H12.3932V7.58608H13.9932V5.98608Z"
                          fill="inherit"
                        />
                        <path
                          d="M12.3936 4.38599H10.7936V5.98599H12.3936V4.38599Z"
                          fill="inherit"
                        />
                        <path
                          d="M13.9932 12.386H12.3932V13.986H13.9932V12.386Z"
                          fill="inherit"
                        />
                        <path
                          d="M12.3936 13.9861H10.7936V15.5861H12.3936V13.9861Z"
                          fill="inherit"
                        />
                      </svg>
                    </span>
                    {previousPage.title}
                  </Link>
                </dd>
              </div>
            )}
            {nextPage && (
              <div className="ml-auto text-right">
                <dt className="text-body4 font-bold tracking-body-text text-white">
                  Next
                </dt>
                <dd className="mt-1">
                  <Link
                    href={nextPage.href}
                    className="text-body3 font-semibold text-amber-50 flex items-center gap-3px hover:text-yellow-300/70 group"
                  >
                    {nextPage.title}
                    <span aria-hidden="true">
                      <svg
                        className="w-4 h-4 fill-amber-50 group-hover:fill-yellow-300/70"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M5.99336 7.58594H12.3934V9.18594H13.9934V7.58594H15.5934V9.18594H17.1934V10.7859H15.5934V12.3859H13.9934V10.7859H3.79336V7.58594H5.99336Z"
                          fill="inherit"
                        />
                        <path
                          d="M13.9932 5.98608H12.3932V7.58608H13.9932V5.98608Z"
                          fill="inherit"
                        />
                        <path
                          d="M12.3936 4.38599H10.7936V5.98599H12.3936V4.38599Z"
                          fill="inherit"
                        />
                        <path
                          d="M13.9932 12.386H12.3932V13.986H13.9932V12.386Z"
                          fill="inherit"
                        />
                        <path
                          d="M12.3936 13.9861H10.7936V15.5861H12.3936V13.9861Z"
                          fill="inherit"
                        />
                      </svg>
                    </span>
                  </Link>
                </dd>
              </div>
            )}
          </dl>
        </div>
        <div className="hidden xl:sticky xl:top-[4.5rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.5rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6">
          <nav aria-labelledby="on-this-page-title" className="w-56">
            {tableOfContents.length > 0 && (
              <>
                <h2
                  id="on-this-page-title"
                  className="text-body4 font-bold tracking-body-text text-white"
                >
                  On this page
                </h2>
                <ol role="list" className="mt-4 space-y-3">
                  {tableOfContents.map((section: any) => (
                    <li key={section.id}>
                      <h3>
                        <Link
                          href={`#${section.id}`}
                          className={clsx(
                            'text-body4 tracking-body-text hover:text-yellow-300/70',
                            isActive(section)
                              ? 'text-body3 font-medium text-yellow-300'
                              : 'text-amber-50'
                          )}
                        >
                          {section.title}
                        </Link>
                      </h3>
                      {section.children.length > 0 && (
                        <ol
                          role="list"
                          className="mt-2 space-y-3 pl-5 text-amber-50"
                        >
                          {section.children.map((subSection: any) => (
                            <li key={subSection.id}>
                              <Link
                                href={`#${subSection.id}`}
                                className={clsx(
                                  'text-body4 tracking-body-text hover:text-yellow-300/70',
                                  isActive(subSection)
                                    ? 'text-yellow-300'
                                    : 'text-amber-50'
                                )}
                              >
                                {subSection.title}
                              </Link>
                            </li>
                          ))}
                        </ol>
                      )}
                    </li>
                  ))}
                </ol>
              </>
            )}
          </nav>
        </div>
      </div>
    </>
  )
}
