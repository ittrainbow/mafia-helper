import { ChangeEvent } from 'react'

// Components types
export type AudioItem = {
  index: number
  src: string
  buttonText: string
}

export type SettingsProps = {
  showModalHandler: (boolean: boolean) => void
  isModal: boolean
}

export type TimerProps = {
  isBells: boolean
}

// UI types
export type ButtonProps = {
  onClick?: () => void
  isDisabled?: boolean
  label: string
  isActive?: boolean
}

export type Ripple = {
  id: number
  x: number
  y: number
  size: number
}

export type SettingsIconProps = {
  color?: string
}

export type SettingsModalProps = {
  isModal: boolean
  onClose: (boolean: boolean) => void
  isBells: boolean
  setIsBells: (value: boolean) => void
}

export type SwitcherProps = {
  isChecked: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

