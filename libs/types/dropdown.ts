export interface DropdownItemProps {
  onClick: () => void | Promise<void>
  label: string
  icon?: JSX.Element
}

export interface DropdownProps {
  label: string
  options: JSX.Element[]
  isOpen: boolean
  setIsOpen: (v: boolean) => void
  onOptionSelected: (index: number) => void
  className?: string
  labelClassName?: string
}
