import clsx from 'clsx'
import { MouseEvent, useRef, useState } from 'react'

import { ButtonProps, Ripple } from '../types'

export function Button({ onClick, isDisabled, label, isActive = false }: ButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([])
  const buttonRef = useRef<HTMLButtonElement>(null)

  const createRipple = (event: MouseEvent<HTMLButtonElement>) => {
    if (isDisabled || !buttonRef.current) return

    const button = buttonRef.current
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    const newRipple: Ripple = {
      id: Date.now(),
      x,
      y,
      size
    }

    setRipples((prev) => [...prev, newRipple])
    setTimeout(() => setRipples((prev) => prev.filter((ripple) => ripple.id !== newRipple.id)), 1200)
  }

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={isDisabled}
      type="button"
      onMouseDown={(event) => createRipple(event)}
      className={clsx(
        `flex-1 min-w-24 max-w-32 min-h-14 shadow-[rgba(0,0,0,0.25)_0px_14px_28px,rgba(0,0,0,0.22)_0px_10px_10px] transition-all duration-[400ms] ease-in-out rounded-2xl font-medium text-blue-300 border border-blue-300 cursor-pointer flex items-center justify-center relative overflow-hidden uppercase select-none [-webkit-tap-highlight-color:transparent]`,
        isDisabled
          ? 'opacity-50 cursor-not-allowed bg-[#484c53]'
          : isActive
          ? 'bg-[#50586b] scale-95'
          : 'bg-transparent scale-100 hover:opacity-80'
      )}
    >
      <span className="relative z-10">{label}</span>
      {!isDisabled && (
        <span className="absolute inset-0 pointer-events-none rounded-2xl">
          {ripples.map((ripple) => (
            <span
              key={ripple.id}
              className="absolute rounded-full bg-text-primary opacity-30"
              style={{
                left: `${ripple.x}px`,
                top: `${ripple.y}px`,
                width: `${ripple.size}px`,
                height: `${ripple.size}px`,
                transform: 'scale(0)',
                animation: 'ripple 1200ms cubic-bezier(0.4, 0, 0.2, 1)',
                transformOrigin: 'center'
              }}
            />
          ))}
        </span>
      )}
    </button>
  )
}
