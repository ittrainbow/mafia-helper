import React, { useEffect, useState } from 'react'
import NoSleep from 'nosleep.js'

import { Timer } from './components/Timer'
import { Player } from './components/Player'
import { Settings } from './components/Settings'
import { Modal } from './UI/Modal'

const getAdvanced = localStorage.getItem('advanced') === 'true' || false
const getBells = localStorage.getItem('bells') === 'true' || false

const App = () => {
  const nosleep = new NoSleep()
  const [paddingTop, setPaddingTop] = useState(0)
  const [modal, setModal] = useState(false)
  const [advanced, setAdvanced] = useState(getAdvanced)
  const [bells, setBells] = useState(getBells)
  const [paddingBottom, setPaddingBottom] = useState(0)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    const timerHeight = document.querySelector('.timer-div').clientHeight + 220
    const windowHeight = window.innerHeight
    const paddingVertical = Math.floor((windowHeight - timerHeight) / 2)

    setPaddingTop(paddingVertical)
    setPaddingBottom(paddingVertical)
    setTimeout(() => setOpacity(1), 450)

    nosleep.enable() // eslint-disable-next-line
  }, [])

  const showModalHandler = (boolean) => setModal(boolean)

  return (
    <>
      <div className="container" style={{ paddingTop, paddingBottom, opacity }}>
        <Settings showModalHandler={showModalHandler} modal={modal} />
        <div className="inner-container">
          <Timer bells={bells} />
          <Player advanced={advanced} />
        </div>
      </div>
      <Modal
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

export default App
