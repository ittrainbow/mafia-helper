import NoSleep from 'nosleep.js'
import { useEffect, useState } from 'react'

import { Player, Settings, Timer } from './components'
import { SettingsModal } from './ui'

const getAdvanced = localStorage.getItem('advanced') === 'true'
const getBells = localStorage.getItem('bells') === 'true'

export function App() {
  const nosleep = new NoSleep()
  const [isModal, setIsModal] = useState(false)
  const [isAdvanced, setIsAdvanced] = useState(getAdvanced)
  const [isBells, setIsBells] = useState(getBells)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    setTimeout(() => setOpacity(1), 450)

    nosleep.enable() // eslint-disable-next-line
  }, [])

  const showModalHandler = (boolean: boolean) => setIsModal(boolean)

  return (
    <>
      <div
        className={`flex flex-col px-12 transition-opacity duration-500 ease-in box-border h-screen max-h-screen overflow-hidden justify-center items-center relative mobile:px-5 ${
          opacity === 1 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Settings showModalHandler={showModalHandler} isModal={isModal} />
        <div className="box-border flex flex-col items-center gap-10 justify-between px-12 w-full mt-0 mobile:px-5 mobile:gap-8">
          <Timer isBells={isBells} />
          <Player isAdvanced={isAdvanced} />
        </div>
      </div>
      <SettingsModal
        isModal={isModal}
        onClose={showModalHandler}
        isAdvanced={isAdvanced}
        isBells={isBells}
        setIsAdvanced={setIsAdvanced}
        setIsBells={setIsBells}
      />
    </>
  )
}
