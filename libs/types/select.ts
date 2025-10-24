export interface SelectProps {
  className?: string
  options: Record<string, any>
  currentOption: any
  onChange: (v: any) => void
  iconLabel?: JSX.Element
}