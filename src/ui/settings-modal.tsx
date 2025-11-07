import clsx from 'clsx'
import { ChangeEvent, useEffect, useState } from 'react'

import { SettingsModalProps } from '../types'
import { Button } from './button'
import { Switcher } from './switcher'

export function SettingsModal({ isModal, onClose, isAdvanced, setIsAdvanced, isBells, setIsBells }: SettingsModalProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isShouldRender, setIsShouldRender] = useState(false)

  useEffect(() => {
    if (isModal) {
      setIsShouldRender(true)
      const timeout = setTimeout(() => setIsVisible(true), 10)
      return () => clearTimeout(timeout)
    }

    setIsVisible(false)
    const timeout = setTimeout(() => setIsShouldRender(false), 300)
    return () => clearTimeout(timeout)
  }, [isModal])

  if (!isShouldRender) return null

  return (
    <div
      className={clsx('fixed inset-0 transition-colors duration-300 ease-in-out z-40', isVisible && 'bg-black/50')}
      onClick={(e) => e.target === e.currentTarget && onClose && onClose(false)}
      aria-modal="true"
      role="dialog"
    >
      <div
        className={clsx(
          'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full min-w-80 max-w-80 rounded-2xl shadow-2xl z-50 transition-all duration-300 ease-in-out bg-bg-primary relative flex flex-col gap-6 items-center p-6 border border-blue-300',
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-full justify-center flex-row transition-all duration-500 gap-2.5">
          <div className="flex w-[40%] items-center justify-center text-blue-300">Фортепиано</div>
          <Switcher
            isChecked={isAdvanced}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const newValue = e.target.checked
              localStorage.setItem('advanced', String(newValue))
              setIsAdvanced(newValue)
            }}
          />
        </div>
        <div className="flex w-full justify-center flex-row transition-all duration-500 gap-2.5">
          <div className="flex w-[40%] items-center justify-center text-blue-300">Колокольчик</div>
          <Switcher
            isChecked={isBells}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const newValue = e.target.checked
              localStorage.setItem('bells', String(newValue))
              setIsBells(newValue)
            }}
          />
        </div>
        <Button onClick={() => onClose && onClose(false)} label="OK" />
      </div>
    </div>
  )
}
