import classNames from 'classnames'

import { CopyIcon, ChangelogIcon, ELinkIcon, ArrowIcon, ELinkSmallIcon, QRCodeIcon, DarkBulletIcon, PlusIcon, PauseIcon, ResumeIcon, CancelIcon, MinusIcon, StarIcon, WithdrawIcon, ClaimIcon } from 'components/icons'

interface IconProps {
  color: string
  icon: string
  size?: [number, number]
  classes?: string
}

const iconsShape: any = {
  changelog: ChangelogIcon,
  copy: CopyIcon,
  eLink: ELinkIcon,
  eLinkSmall: ELinkSmallIcon,
  qrCode: QRCodeIcon,
  darkBullet: DarkBulletIcon,
  plus: PlusIcon,
  minus: MinusIcon,
  pause: PauseIcon,
  resume: ResumeIcon,
  cancel: CancelIcon,
  star: StarIcon,
  arrow: ArrowIcon,
  withdraw: WithdrawIcon,
  claim: ClaimIcon,
}

const iconStyles: Record<string, string> = {
  '#2F2F26': 'fill-gray-900',
  '#3D3E32': 'fill-olive-800',
}

export const Icon: React.FC<IconProps> = ({ color = '#2F2F26', icon, classes, size = [20, 20], ...props }) => {
  let IconComponent = iconsShape[icon]

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${size[0]} ${size[1]}`}
      fill="none"
      className={classNames(classes, iconStyles[color])}
      {...props}
    >
      <IconComponent color={color} />
    </svg>
  )
}