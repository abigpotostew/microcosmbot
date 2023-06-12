import Link from 'next/link'
import clsx from 'clsx'

const styles: any = {
  primary:
    'rounded-full bg-yellow-300 h-12 px-9 text-label text-13px inline-flex items-center justify-center uppercase hover:bg-amber-50 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-300/50 active:bg-amber-50',
  secondary:
    'rounded-full h-12 px-9 text-label text-13px text-white border border-olive-700 inline-flex items-center justify-center uppercase hover:border-olive-600 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-border-olive-700/50 active:border-olive-600',
}

export function Button({ variant = 'primary', className, href, ...props }: any) {
  className = clsx(styles[variant], className)

  return href ? (
    <Link href={href} className={className} {...props} />
  ) : (
    <button className={className} {...props} />
  )
}
