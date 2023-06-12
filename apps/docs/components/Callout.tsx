import clsx from 'clsx'

import { Icon } from 'components/Icon'

const styles: any = {
  note: {
    container:
      'bg-olive-800 ring-1 ring-olive-700',
    title: 'text-yellow-300',
    body: 'text-amber-50 [--tw-prose-background:theme(colors.sky.50)] prose-a:text-red prose-code:text-amber-50',
  },
  warning: {
    container:
      'bg-olive-800 ring-1 ring-olive-700',
    title: 'text-yellow-600',
    body: 'text-amber-50 [--tw-prose-underline:theme(colors.amber.50)] [--tw-prose-background:theme(colors.olive.800)] prose-a:text-red prose-code:text-amber-50',
  },
}

const icons: any = {
  note: (props: any) => <Icon icon="lightbulb" {...props} />,
  warning: (props: any) => <Icon icon="warning" color="orange" {...props} />,
}

export function Callout({ type = 'note', title, children }: any) {
  let IconComponent = icons[type]

  return (
    <div className={clsx('my-8 flex rounded-3xl p-6', styles[type].container)}>
      <IconComponent className="h-8 w-8 flex-none" />
      <div className="ml-4 flex-auto">
        <p className={clsx('m-0 font-display text-xl', styles[type].title)}>
          {title}
        </p>
        <div className={clsx('prose mt-2.5', styles[type].body)}>
          {children}
        </div>
      </div>
    </div>
  )
}
