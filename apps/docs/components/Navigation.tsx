import Link from 'next/link'
import { useRouter } from 'next/router'
import clsx from 'clsx'

interface NavigationProps {
  navigation: Record<string, any>
  className?: string
}

export const Navigation: React.FC<NavigationProps> = ({ navigation, className }) => {
  let router = useRouter()

  return (
    <nav className={clsx('text-base lg:text-sm', className)}>
      <ul role="list" className="space-y-16">
        {navigation.map((section: any) => (
          <li key={section.title}>
            <h2 className="text-label text-sm leading-4 font-bold dark:text-white">
              {section.title}
            </h2>
            <ul
              role="list"
              className="mt-2 space-y-2 border-l-2 border-olive-700 lg:mt-6 lg:space-y-4"
            >
              {section.links.map((link: any) => (
                <li key={link.href} className="relative">
                  <Link
                    href={link.href}
                    className={clsx(
                      'text-body4 block w-full pl-3.5 before:pointer-events-none before:absolute before:-left-1 before:top-1/2 before:h-1.5 before:w-1.5 before:-translate-y-1/2 before:rounded-full',
                      link.href === router.pathname
                        ? 'text-yellow-300 before:bg-yellow-300'
                        : 'text-amber-50 before:hidden before:bg-yellow-300/70 hover:text-yellow-300/70 hover:before:block'
                    )}
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  )
}
