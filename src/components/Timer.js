import React, { useState, useEffect } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

import { getColor } from '../helpers'

export const Timer = () => {
  const [color, setColor] = useState('rgba(0, 255, 0, .8')
  const [playIsOn, setPlayIsOn] = useState(false)
  const [percentage, setPercentage] = useState(100)

  useEffect(() => {
    if (playIsOn) {
      const newPercentage = Math.round((percentage - 0.417) * 100) / 100 // default 417
      setTimeout(() => {
        newPercentage >= 0 && setPercentage(newPercentage)
        if (Math.round(newPercentage) === 0) setTimeout(() => setPlayIsOn(false), 1000)
      }, 250) // default 250
    }
    const color = getColor(percentage)

    if (!playIsOn) {
      const newPercentage = percentage + 1 > 100 ? 100 : percentage + 1
      setTimeout(() => setPercentage(newPercentage), 5)
    }
    setColor(color) // eslint-disable-next-line
  }, [percentage, playIsOn])

  const getText = () => {
    const tics = Math.round((percentage * 60) / 100)
    const text = tics === 60 ? '01:00' : tics > 9 ? '00:' + tics : '00:0' + tics
    return text
  }

  const click = () => setPlayIsOn(!playIsOn)

  const getClass = playIsOn ? 'timer-active timer-div' : 'timer timer-div'

  return (
    <div className={getClass} onClick={click}>
      <CircularProgressbar
        value={percentage}
        text={getText()}
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
