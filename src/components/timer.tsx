import { getDownloadURL, getStorage, ref } from 'firebase/storage'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

import clsx from 'clsx'
import { app } from '../db/firebase'
import { TimerProps } from '../types'

function getColor(percentage: number): string {
  const red = percentage < 50 ? 255 : (255 - Math.floor(percentage * 2.55)) * 2
  const green = percentage < 50 ? 255 - Math.floor((50 - percentage) * 5.1) : 255
  return `rgba(${red}, ${green}, 0, 1)`
}

export function Timer({ isBells }: TimerProps) {
  const storage = getStorage(app)

  const [timerText, setTimerText] = useState('01:00')
  const [bell10, setBell10] = useState<HTMLAudioElement | null>(null)
  const [bell0, setBell0] = useState<HTMLAudioElement | null>(null)
  const [color, setColor] = useState('rgba(0, 255, 0, .8')
  const [isPlaying, setIsPlaying] = useState(false)
  const [percentage, setPercentage] = useState(100)

  useEffect(() => {
    const url = (variable: string) => `gs://circle-38cc7.appspot.com/${variable}.mp3`

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

  const rewindIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const countdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isPlayingRef = useRef<boolean>(isPlaying)

  useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  useEffect(() => {
    if (!isPlaying) {
      if (countdownTimeoutRef.current) {
        clearTimeout(countdownTimeoutRef.current)
        countdownTimeoutRef.current = null
      }

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

      return
    }

    if (rewindIntervalRef.current) {
      clearInterval(rewindIntervalRef.current)
      rewindIntervalRef.current = null
    }

    setPercentage((prevPercentage) => {
      if (prevPercentage < 100) {
        return 100
      }
      return prevPercentage
    })

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
  }, [isPlaying])

  useEffect(() => {
    if (isPlaying) {
      if (countdownTimeoutRef.current) {
        clearTimeout(countdownTimeoutRef.current)
        countdownTimeoutRef.current = null
      }

      const scheduleNextTick = () => {
        countdownTimeoutRef.current = setTimeout(() => {
          if (!isPlayingRef.current) {
            countdownTimeoutRef.current = null
            return
          }

          setPercentage((prevPercentage) => {
            const newPercentage = Math.round((prevPercentage - 0.417) * 100) / 100
            if (newPercentage >= 0) {
              return newPercentage
            }
            return 0
          })
          countdownTimeoutRef.current = null

          if (isPlayingRef.current) {
            scheduleNextTick()
          }
        }, 250)
      }

      scheduleNextTick()
    } else {
      if (countdownTimeoutRef.current) {
        clearTimeout(countdownTimeoutRef.current)
        countdownTimeoutRef.current = null
      }
    }

    const tics = Math.round((percentage * 60) / 100)
    const text = tics === 60 ? '01:00' : tics > 9 ? '00:' + tics : '00:0' + tics
    const color = getColor(percentage)

    if (isPlaying && isBells && tics === 10 && bell10) bell10.play()
    if (isPlaying && isBells && tics === 0 && bell0) bell0.play()
    if (isPlaying && percentage < 0.5) setTimeout(() => setIsPlaying(false), 1000)

    setColor(color)
    setTimerText(text)

    // eslint-disable-next-line
  }, [percentage, isPlaying, isBells, bell10, bell0])

  const onClick = () => {
    if (!isPlaying) {
      setPercentage((prevPercentage) => {
        if (prevPercentage < 100) return 100
        return prevPercentage
      })
    }
    setIsPlaying((prev) => !prev)
  }

  return (
    <div
      className={clsx(
        'w-[300px] cursor-pointer transition-all duration-[800ms] ease-in-out [-webkit-tap-highlight-color:transparent]',
        isPlaying ? 'bg-bg-secondary rounded-full scale-95' : 'rounded-none scale-100'
      )}
      onClick={onClick}
      onKeyDown={(e: KeyboardEvent<HTMLDivElement>) => {
        if (e.key !== 'Enter' && e.key !== ' ') return
        e.preventDefault()
        onClick()
      }}
      role="button"
      tabIndex={0}
      aria-label={isPlaying ? 'Остановить таймер' : 'Запустить таймер'}
    >
      <CircularProgressbar
        value={percentage}
        text={timerText}
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
            fontFamily: '"Helvetica", sans-serif',
            letterSpacing: '0.05em'
          }
        }}
      />
    </div>
  )
}
