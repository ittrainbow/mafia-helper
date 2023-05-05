import React, { useState, useEffect } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'
import 'react-circular-progressbar/dist/styles.css'

import { getColor } from '../helpers'
import { app } from '../db/firebase'

export const Timer = ({ bells }) => {
  const storage = getStorage(app)
  const [timerText, setTimerText] = useState('01:00')
  const [bell10, setBell10] = useState(null)
  const [bell0, setBell0] = useState(null)
  const [color, setColor] = useState('rgba(0, 255, 0, .8')
  const [playIsOn, setPlayIsOn] = useState(false)
  const [percentage, setPercentage] = useState(100)

  // useEffect(() => {
  //   if (playIsOn && bells && percentage < 19 && percentage > 18) bell10.play()
  //   if (playIsOn && bells && percentage < 0.5) setTimeout(() => bell0.play(), 500)
  //   // eslint-disable-next-line
  // }, [percentage])

  useEffect(() => {
    const url = (variable) => `gs://circle-38cc7.appspot.com/${variable}.mp3`

    getDownloadURL(ref(storage, url('bell10'))).then((response) => {
      const audio = new Audio(response)
      setBell10(audio)
    })

    getDownloadURL(ref(storage, url('bell0'))).then((response) => {
      const audio = new Audio(response)
      setBell0(audio)
    })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    const newPercentage = Math.round((percentage - 0.417) * 100) / 100 // default 417
    if (playIsOn) {
      setTimeout(() => {
        newPercentage >= 0 && setPercentage(newPercentage)
        if (newPercentage < 0.5) setTimeout(() => setPlayIsOn(false), 1000)
      }, 250) // default 250
    }
    const color = getColor(percentage)

    if (!playIsOn) {
      const newPercentage = percentage + 1 > 100 ? 100 : percentage + 1
      setTimeout(() => setPercentage(newPercentage), 25)
    }
    setColor(color)
    setColor(color)
    setColor(color)

    const tics = Math.round((percentage * 60) / 100)
    const text = tics === 60 ? '01:00' : tics > 9 ? '00:' + tics : '00:0' + tics

    if (playIsOn && bells && tics === 10) bell10.play()
    if (playIsOn && bells && tics === 0) bell0.play()

    setTimerText(text)

    // eslint-disable-next-line
  }, [percentage, playIsOn])

    if (playIsOn && bells && tics === 10) bell10.play()
    if (playIsOn && bells && tics === 0) bell0.play()

    setTimerText(text)

    // eslint-disable-next-line
  }, [percentage, playIsOn])

  const click = () => setPlayIsOn(!playIsOn)

  const getClass = playIsOn ? 'timer-active timer-div' : 'timer timer-div'

  return (
    <div className={getClass} onClick={click}>
      <CircularProgressbar
        value={percentage}
        text={timerText}
        text={timerText}
        percentage={percentage}
        strokeWidth={2 + (100 - percentage) * 0.03}
        styles={{
          path: {
            stroke: color,
            strokeLinecap: 'butt',
            transition: 'stroke-dashoffset 0.5s ease 0s',
            transformOrigin: 'center center'
          },
          trail: {
            stroke: '#d6d7d9',
            strokeLinecap: 'butt',
            transformOrigin: 'center center'
          },
          text: {
            fill: '#d6d7d9',
            fontWeight: 600,
            fontSize: '18px'
          }
        }}
      />
    </div>
  )
}
