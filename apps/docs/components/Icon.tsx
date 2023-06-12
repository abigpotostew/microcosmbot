import clsx from 'clsx'

import { InstallationIcon } from 'components/icons/InstallationIcon'
import { LightbulbIcon } from 'components/icons/LightbulbIcon'
import { PluginsIcon } from 'components/icons/PluginsIcon'
import { PresetsIcon } from 'components/icons/PresetsIcon'
import { ThemingIcon } from 'components/icons/ThemingIcon'
import { WarningIcon } from 'components/icons/WarningIcon'
import { DocsIcon } from 'components/icons/DocsIcon'
import { GithubIcon } from 'components/icons/GithubIcon'
import { ChangelogIcon } from 'components/icons/ChangelogIcon'
import { ExplorerIcon } from 'components/icons/ExplorerIcon'
import { CloseIcon } from 'components/icons/CloseIcon'
import { BurgerIcon } from 'components/icons/BurgerIcon'

const icons: any = {
  installation: InstallationIcon,
  presets: PresetsIcon,
  plugins: PluginsIcon,
  theming: ThemingIcon,
  lightbulb: LightbulbIcon,
  warning: WarningIcon,
  docs: DocsIcon,
  github: GithubIcon,
  changelog: ChangelogIcon,
  explorer: ExplorerIcon,
  close: CloseIcon,
  burger: BurgerIcon,
}

const iconStyles: any = {
  '#2F2F26': 'fill-gray-900',
  '#FFFFFF': 'fill-white',
  '#EEF57F': 'fill-yellow-300',
  '#D9AD57': 'fill-yellow-600',
  blue: '[--icon-foreground:theme(colors.slate.900)] [--icon-background:theme(colors.white)]',
  amber:
    '[--icon-foreground:theme(colors.amber.900)] [--icon-background:theme(colors.amber.100)]',
}

export function Icon({ color = '#EEF57F', icon, className, size = [32, 32], ...props }: any) {
  let IconComponent = icons[icon]

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${size[0]} ${size[1]}`}
      fill="none"
      className={clsx(className, iconStyles[color])}
      {...props}
    >
      <IconComponent color={color} />
    </svg>
  )
}

export function LightMode({ className, ...props }: any) {
  return <g className={clsx('dark:hidden', className)} {...props} />
}

export function DarkMode({ className, ...props }: any) {
  return <g className={clsx('hidden dark:inline', className)} {...props} />
}
