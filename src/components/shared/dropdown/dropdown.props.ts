import { ReactNode } from 'react'

export interface DropdownProps {
  trigger?: ReactNode
  children: ReactNode
  placeholder?: string
  isOpen?: boolean
  onToggle?: (isOpen: boolean) => void
  disabled?: boolean
  className?: string
  dropdownClassName?: string
}