import clsx from 'clsx'
import { SettingsIcon } from '../ui'

export function Settings({ showModalHandler, modal }) {
  const iconColor = modal ? '#50586b' : '#93c5fd'

  return (
    <div className="absolute top-5 w-full max-w-[300px] h-10 left-1/2 -translate-x-1/2 text-text-primary transition-all duration-500 ease flex justify-start items-center pl-0 box-border z-10">
      <div
        className={clsx(
          'transition-all duration-300 ease-in cursor-pointer [-webkit-tap-highlight-color:transparent]',
          modal ? 'scale-[1.125]' : 'scale-[1.25]'
        )}
        onClick={() => showModalHandler(true)}
      >
        <SettingsIcon color={iconColor} />
      </div>
    </div>
  )
}
