import clsx from 'clsx'
import { ChangeEvent, KeyboardEvent, useState } from 'react'

import { SwitcherProps } from '../types'

export function Switcher({ isChecked, onChange }: SwitcherProps) {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <span
      className={clsx(
        'relative inline-flex items-center h-6 w-11 scale-[1.25] rounded-full transition-colors duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary focus:ring-cyan-600',
        isChecked ? 'bg-cyan-600' : 'bg-gray-600'
      )}
      onClick={() => {
        if (!onChange) return
        onChange({ target: { checked: !isChecked } } as ChangeEvent<HTMLInputElement>)
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      role="switch"
      aria-checked={isChecked}
      tabIndex={0}
      onKeyDown={(e: KeyboardEvent<HTMLSpanElement>) => {
        if (e.key === 'Enter' && onChange) {
          e.preventDefault()
          onChange({ target: { checked: !isChecked } } as ChangeEvent<HTMLInputElement>)
        }
      }}
    >
      <span
        className={clsx(
          'absolute left-1 inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 ease-in-out',
          isChecked ? 'translate-x-5' : 'translate-x-0',
          isPressed ? 'scale-90' : 'scale-100'
        )}
      />
    </span>
  )
}
