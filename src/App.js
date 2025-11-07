import NoSleep from 'nosleep.js'
import { useEffect, useState } from 'react'

import { Player, Settings, Timer } from './components'
import { SettingsModal } from './ui'

const getAdvanced = localStorage.getItem('advanced') === 'true' || false
const getBells = localStorage.getItem('bells') === 'true' || false

export function App() {
  const nosleep = new NoSleep()
  const [modal, setModal] = useState(false)
  const [advanced, setAdvanced] = useState(getAdvanced)
  const [bells, setBells] = useState(getBells)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    setTimeout(() => setOpacity(1), 450)

    nosleep.enable() // eslint-disable-next-line
  }, [])

  const showModalHandler = (boolean) => setModal(boolean)

  return (
    <>
      <div
        className={`flex flex-col px-12 transition-opacity duration-500 ease-in box-border h-screen max-h-screen overflow-hidden justify-center items-center relative mobile:px-5 ${
          opacity === 1 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <Settings showModalHandler={showModalHandler} modal={modal} />
        <div className="box-border flex flex-col items-center gap-10 justify-between px-12 w-full mt-0 mobile:px-5 mobile:gap-8">
          <Timer bells={bells} />
          <Player advanced={advanced} />
        </div>
      </div>
      <SettingsModal
        modal={modal}
        onClose={showModalHandler}
        advanced={advanced}
        bells={bells}
        setAdvanced={setAdvanced}
        setBells={setBells}
      />
    </>
  )
}
