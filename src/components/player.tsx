import { getDownloadURL, getStorage, ref } from 'firebase/storage'
import { useEffect, useState } from 'react'

import { app } from '../db/firebase'
import { AudioItem, PlayerProps } from '../types'
import { Button } from '../ui'

const num = 18

export function Player({ isAdvanced }: PlayerProps) {
  const storage = getStorage(app)
  const [audioRoles, setAudioRoles] = useState<string | null>(null)
  const [audioNight, setAudioNight] = useState<string | null>(null)
  const [audioBreak, setAudioBreak] = useState<string | null>(null)
  const [audioDogovorka, setAudioDogovorka] = useState<string | null>(null)
  const [nextAudio, setNextAudio] = useState<string | null>(null)
  const [nextAudioId, setNextAudioId] = useState<number | null>(null)
  const [buttonActive, setButtonActive] = useState<number | null>(null)
  const [lastActive, setLastActive] = useState<number | null>(null)
  const [isCurrentAudioPlaying, setIsCurrentAudioPlaying] = useState(false)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)

  const [array, setArray] = useState<number[]>([])

  const audioArray: AudioItem[] = [
    { index: 0, label: 'new_roles', setter: setAudioRoles, isDisabled: !audioRoles, buttonText: 'Роли' },
    {
      index: 1,
      label: 'new_dogovorka',
      setter: setAudioDogovorka,
      isDisabled: !audioDogovorka,
      buttonText: 'Договорка'
    },
    { index: 2, label: 'new_night', setter: setAudioNight, isDisabled: !audioNight, buttonText: 'Ночь' },
    { index: 3, label: 'new_break', setter: setAudioBreak, isDisabled: !audioBreak, buttonText: 'Перерыв' }
  ]

  useEffect(() => {
    const url = (variable: string | number) => `gs://circle-38cc7.appspot.com/${variable}.mp3`

    audioArray.forEach((audio) => {
      const { label, setter } = audio
      getDownloadURL(ref(storage, url(label))).then((response) => setter(response))
    })

    const array = Array.from(Array(num).keys()).sort(() => 0.5 - Math.random())
    getDownloadURL(ref(storage, url(array[num - 1]))).then((response) => {
      const nextAudio = response
      setNextAudio(nextAudio)
    })

    setArray(array)
    // eslint-disable-next-line
  }, [isAdvanced])

  useEffect(() => {
    if (!array || nextAudioId === null) return
    const url = `gs://circle-38cc7.appspot.com/${array[nextAudioId]}.mp3`
    getDownloadURL(ref(storage, url)).then((response) => setNextAudio(response))
    // eslint-disable-next-line
  }, [nextAudioId, array])

  useEffect(() => {
    if (!currentAudio) return
    currentAudio.play()
    currentAudio.loop = true
  }, [currentAudio])

  const playSimpleHandler = (index: number) => {
    if (currentAudio) {
      currentAudio.pause()
      setIsCurrentAudioPlaying(false)
    }

    if (index !== buttonActive) {
      const audio = () => {
        switch (index) {
          case 0:
            return audioRoles ? new Audio(audioRoles) : undefined
          case 1:
            return audioDogovorka ? new Audio(audioDogovorka) : undefined
          case 2:
            return audioNight ? new Audio(audioNight) : undefined
          case 3:
            return audioBreak ? new Audio(audioBreak) : undefined
          default:
            return undefined
        }
      }
      const audioElement = audio()

      if (!audioElement) return

      setCurrentAudio(audioElement)
      setButtonActive(index)
      return setIsCurrentAudioPlaying(true)
    }

    setButtonActive(null)
  }

  const playAdvancedHandler = (index: number) => {
    if (index !== buttonActive) {
      switch (index) {
        case 0:
          if (audioRoles) setCurrentAudio(new Audio(audioRoles))
          break
        case 1:
          if (audioDogovorka) setCurrentAudio(new Audio(audioDogovorka))
          break
        case 2:
          if (isAdvanced && nextAudio) {
            setCurrentAudio(new Audio(nextAudio))
            const newNextAudioId = nextAudioId === num ? 0 : (nextAudioId || 0) + 1
            setNextAudioId(newNextAudioId)
            break
          }
          if (audioNight) setCurrentAudio(new Audio(audioNight))
          break
        case 3:
          if (audioBreak) setCurrentAudio(new Audio(audioBreak))
          break
        default:
          break
      }
      if (currentAudio) currentAudio.pause()
      setButtonActive(index)
      return setIsCurrentAudioPlaying(true)
    }

    if (!currentAudio) return

    currentAudio.pause()
    setIsCurrentAudioPlaying(false)
    setButtonActive(null)
  }

  const playHandler = (index: number) => {
    setLastActive(index)
    isAdvanced ? playAdvancedHandler(index) : playSimpleHandler(index)
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div className="flex gap-5 w-full justify-center">
        {audioArray.slice(0, 2).map((audio) => {
          const { buttonText, index, isDisabled } = audio
          return (
            <Button
              key={index}
              onClick={() => playHandler(index)}
              isDisabled={isDisabled}
              label={buttonText}
              isActive={index === buttonActive}
            />
          )
        })}
      </div>
      <div className="flex gap-5 w-full justify-center">
        {audioArray.slice(2, 4).map((audio) => {
          const { buttonText, index, isDisabled } = audio
          return (
            <Button
              key={index}
              onClick={() => playHandler(index)}
              isDisabled={isDisabled}
              label={buttonText}
              isActive={index === buttonActive}
            />
          )
        })}
      </div>
      <div className="flex gap-5 w-full justify-center">
        <Button
          isDisabled={!currentAudio}
          onClick={() => {
            if (!currentAudio) return

            setIsCurrentAudioPlaying((prev) => !prev)

            if (currentAudio.paused) {
              currentAudio.play()
              return setButtonActive(lastActive)
            }

            currentAudio.pause()
            setButtonActive(null)
          }}
          label={isCurrentAudioPlaying || !currentAudio ? 'Пауза' : 'Играть'}
        />
        <Button
          isDisabled={!currentAudio}
          onClick={() => {
            if (!currentAudio) return

            currentAudio.pause()
            setCurrentAudio(null)
            setButtonActive(null)
          }}
          label="Стоп"
        />
      </div>
    </div>
  )
}
