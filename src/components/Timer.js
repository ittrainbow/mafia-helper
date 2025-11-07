import { getDownloadURL, getStorage, ref } from 'firebase/storage'
import { useEffect, useRef, useState } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

import { app } from '../db/firebase'
import { getColor } from '../helpers'

export const Timer = ({ bells }) => {
  const storage = getStorage(app)

  const [timerText, setTimerText] = useState('01:00')
  const [bell10, setBell10] = useState(null)
  const [bell0, setBell0] = useState(null)
  const [color, setColor] = useState('rgba(0, 255, 0, .8')
  const [playIsOn, setPlayIsOn] = useState(false)
  const [percentage, setPercentage] = useState(100)

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

  const rewindIntervalRef = useRef(null)
  const countdownTimeoutRef = useRef(null)
  const playIsOnRef = useRef(playIsOn)

  useEffect(() => {
    playIsOnRef.current = playIsOn
  }, [playIsOn])

  useEffect(() => {
    if (!playIsOn) {
      // Очищаем таймаут обратного отсчета перед запуском перемотки
      if (countdownTimeoutRef.current) {
        clearTimeout(countdownTimeoutRef.current)
        countdownTimeoutRef.current = null
      }

      // Очищаем предыдущий интервал перед созданием нового
      if (rewindIntervalRef.current) {
        clearInterval(rewindIntervalRef.current)
        rewindIntervalRef.current = null
      }

      rewindIntervalRef.current = setInterval(() => {
        setPercentage((prevPercentage) => {
          if (prevPercentage >= 100) {
            if (rewindIntervalRef.current) {
              clearInterval(rewindIntervalRef.current)
              rewindIntervalRef.current = null
            }
            return 100
          }
          const newPercentage = prevPercentage + 2.5 > 100 ? 100 : prevPercentage + 2.5
          return newPercentage
        })
      }, 25)
    } else {
      // Очищаем интервал обратной перемотки при запуске таймера
      if (rewindIntervalRef.current) {
        clearInterval(rewindIntervalRef.current)
        rewindIntervalRef.current = null
      }
      // Сбрасываем процент в 100% при запуске таймера
      setPercentage((prevPercentage) => {
        if (prevPercentage < 100) {
          return 100
        }
        return prevPercentage
      })
    }

    return () => {
      if (rewindIntervalRef.current) {
        clearInterval(rewindIntervalRef.current)
        rewindIntervalRef.current = null
      }
      if (countdownTimeoutRef.current) {
        clearTimeout(countdownTimeoutRef.current)
        countdownTimeoutRef.current = null
      }
    }
  }, [playIsOn])

  useEffect(() => {
    if (playIsOn) {
      // Очищаем предыдущий таймаут перед созданием нового
      if (countdownTimeoutRef.current) {
        clearTimeout(countdownTimeoutRef.current)
        countdownTimeoutRef.current = null
      }

      const scheduleNextTick = () => {
        countdownTimeoutRef.current = setTimeout(() => {
          // Проверяем актуальное состояние через ref
          if (!playIsOnRef.current) {
            countdownTimeoutRef.current = null
            return
          }

          setPercentage((prevPercentage) => {
            const newPercentage = Math.round((prevPercentage - 0.417) * 100) / 100 // 0.417% per 250ms for 60 seconds
            if (newPercentage >= 0) {
              return newPercentage
            }
            return 0
          })
          countdownTimeoutRef.current = null
          // Рекурсивно запускаем следующий тик, если таймер все еще активен
          if (playIsOnRef.current) {
            scheduleNextTick()
          }
        }, 250) // default 250
      }

      scheduleNextTick()
    } else {
      // Очищаем таймаут при остановке таймера
      if (countdownTimeoutRef.current) {
        clearTimeout(countdownTimeoutRef.current)
        countdownTimeoutRef.current = null
      }
    }

    const tics = Math.round((percentage * 60) / 100)
    const text = tics === 60 ? '01:00' : tics > 9 ? '00:' + tics : '00:0' + tics
    const color = getColor(percentage)

    if (playIsOn && bells && tics === 10) bell10.play()
    if (playIsOn && bells && tics === 0) bell0.play()

    // Проверяем окончание таймера
    if (playIsOn && percentage < 0.5) {
      setTimeout(() => setPlayIsOn(false), 1000)
    }

    setColor(color)
    setTimerText(text)

    // eslint-disable-next-line
  }, [percentage, playIsOn])

  const click = () => {
    if (!playIsOn) {
      // При запуске таймера сбрасываем в начало, если процент не 100%
      setPercentage((prevPercentage) => {
        if (prevPercentage < 100) {
          return 100
        }
        return prevPercentage
      })
    }
    setPlayIsOn(!playIsOn)
  }

  const getClass = playIsOn ? 'timer-active timer-div' : 'timer timer-div'

  return (
    <div className={getClass} onClick={click}>
      <CircularProgressbar
        value={percentage}
        text={timerText}
        percentage={percentage}
        strokeWidth={5 + (100 - percentage) * 0.03}
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
            fontSize: '20px',
            textAnchor: 'middle',
            dominantBaseline: 'middle',
            fontFamily: 'Courier, monospace',
            fontVariantNumeric: 'normal',
            transform: 'scaleY(1.08)',
            transformOrigin: 'center center'
          }
        }}
      />
    </div>
  )
}
