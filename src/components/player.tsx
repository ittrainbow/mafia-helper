import { useEffect, useRef, useState } from 'react'

import { AudioItem } from '../types'
import { Button } from '../ui'

const audioSrc = (file: string) => `${process.env.PUBLIC_URL}/audio/${file}`

const tracks: AudioItem[] = [
  { index: 0, src: audioSrc('01-roles.mp3'), buttonText: 'Роли' },
  { index: 1, src: audioSrc('03-dogovorka.mp3'), buttonText: 'Договорка' },
  { index: 2, src: audioSrc('04-night.mp3'), buttonText: 'Ночь' },
  { index: 3, src: audioSrc('02-countdown.mp3'), buttonText: 'Перерыв' }
]

export function Player() {
  const audiosRef = useRef<HTMLAudioElement[]>([])
  const [buttonActive, setButtonActive] = useState<number | null>(null)
  const [lastActive, setLastActive] = useState<number | null>(null)
  const [isCurrentAudioPlaying, setIsCurrentAudioPlaying] = useState(false)

  useEffect(() => {
    audiosRef.current = tracks.map((track) => {
      const audio = new Audio(track.src)
      audio.preload = 'auto'
      audio.loop = true
      return audio
    })

    return () => {
      audiosRef.current.forEach((audio) => {
        audio.pause()
        audio.removeAttribute('src')
        audio.load()
      })
      audiosRef.current = []
    }
  }, [])

  const stopAll = () => {
    audiosRef.current.forEach((audio) => {
      audio.pause()
      audio.currentTime = 0
    })
  }

  const playHandler = (index: number) => {
    const audio = audiosRef.current[index]
    if (!audio) return

    setLastActive(index)

    if (index === buttonActive) {
      audio.pause()
      setButtonActive(null)
      setIsCurrentAudioPlaying(false)
      return
    }

    stopAll()
    void audio.play()
    setButtonActive(index)
    setIsCurrentAudioPlaying(true)
  }

  const hasSelection = lastActive !== null

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div className="flex gap-5 w-full justify-center">
        {tracks.slice(0, 2).map((audio) => {
          const { buttonText, index } = audio
          return (
            <Button
              key={index}
              onClick={() => playHandler(index)}
              label={buttonText}
              isActive={index === buttonActive}
            />
          )
        })}
      </div>
      <div className="flex gap-5 w-full justify-center">
        {tracks.slice(2, 4).map((audio) => {
          const { buttonText, index } = audio
          return (
            <Button
              key={index}
              onClick={() => playHandler(index)}
              label={buttonText}
              isActive={index === buttonActive}
            />
          )
        })}
      </div>
      <div className="flex gap-5 w-full justify-center">
        <Button
          isDisabled={!hasSelection}
          onClick={() => {
            const audio = lastActive !== null ? audiosRef.current[lastActive] : null
            if (!audio) return

            if (audio.paused) {
              void audio.play()
              setButtonActive(lastActive)
              setIsCurrentAudioPlaying(true)
              return
            }

            audio.pause()
            setButtonActive(null)
            setIsCurrentAudioPlaying(false)
          }}
          label={isCurrentAudioPlaying ? 'Пауза' : 'Играть'}
        />
        <Button
          isDisabled={!hasSelection}
          onClick={() => {
            stopAll()
            setButtonActive(null)
            setIsCurrentAudioPlaying(false)
            setLastActive(null)
          }}
          label="Стоп"
        />
      </div>
    </div>
  )
}
