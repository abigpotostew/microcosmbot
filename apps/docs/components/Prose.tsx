import clsx from 'clsx'

export function Prose({ as: Component = 'div', classes, ...props }: any) {
  return (
    <Component
      className={clsx(
        classes,
        'prose prose-olive max-w-none text-body3 text-amber-50',
        // headings
        'prose-h1:{text-title1} prose-h2:{text-title2} prose-h3:{text-title3} prose-h4:{text-title4} prose-h5:{text-title5} prose-h6:{text-title6} prose-headings:text-white',
        // lead
        'prose-lead:text-body1 prose-lead:text-amber-50',
        // links
        'prose-a:text-body3 prose-a:text-red',
        // link underline
        'prose-a:no-underline hover:prose-a:underline hover:prose-a:[--tw-prose-underline-size:2px]',
        // pre
        'prose-pre:rounded-xl prose-pre:bg-olive-800 prose-pre:ring-1 prose-pre:ring-olive-700',
        // hr
        'prose-hr:border-olive-700 prose-hr: spacing-y-12'
      )}
      {...props}
    />
  )
}
