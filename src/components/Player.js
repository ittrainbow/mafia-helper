import { getDownloadURL, getStorage, ref } from 'firebase/storage'
import { useEffect, useState } from 'react'

import { app } from '../db/firebase'
import { Button } from '../ui'

const num = 18

export function Player({ advanced }) {
  const storage = getStorage(app)
  const [audioRoles, setAudioRoles] = useState(null)
  const [audioNight, setAudioNight] = useState(null)
  const [audioBreak, setAudioBreak] = useState(null)
  const [audioDogovorka, setAudioDogovorka] = useState(null)
  const [nextAudio, setNextAudio] = useState(null)
  const [nextAudioId, setNextAudioId] = useState(null)
  const [buttonActive, setButtonActive] = useState(null)
  const [lastActive, setLastActive] = useState(null)
  const [currentAudioPlaying, setCurrentAudioPlaying] = useState(false)
  const [currentAudio, setCurrentAudio] = useState(null)

  const [array, setArray] = useState([])

  const audioArray = [
    { index: 0, label: 'new_roles', setter: setAudioRoles, disabled: !audioRoles, buttonText: 'Роли' },
    { index: 1, label: 'new_dogovorka', setter: setAudioDogovorka, disabled: !audioDogovorka, buttonText: 'Договорка' },
    { index: 2, label: 'new_night', setter: setAudioNight, disabled: !audioNight, buttonText: 'Ночь' },
    { index: 3, label: 'new_break', setter: setAudioBreak, disabled: !audioBreak, buttonText: 'Перерыв' }
  ]

  useEffect(() => {
    const url = (variable) => `gs://circle-38cc7.appspot.com/${variable}.mp3`

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
  }, [advanced])

  useEffect(() => {
    if (!array || !nextAudioId) return
    const url = `gs://circle-38cc7.appspot.com/${array[nextAudioId]}.mp3`
    getDownloadURL(ref(storage, url)).then((response) => setNextAudio(response))
    // eslint-disable-next-line
  }, [nextAudioId, array])

  useEffect(() => {
    if (!currentAudio) return
    currentAudio.play()
    currentAudio.loop = true
  }, [currentAudio])

  const playSimpleHandler = (index) => {
    if (currentAudio) {
      currentAudio.pause()
      setCurrentAudioPlaying(false)
    }

    if (index !== buttonActive) {
      const audio = () => {
        switch (index) {
          case 0:
            return new Audio(audioRoles)
          case 1:
            return new Audio(audioDogovorka)
          case 2:
            return new Audio(audioNight)
          case 3:
            return new Audio(audioBreak)
          default:
            return
        }
      }
      setCurrentAudio(audio)
      setButtonActive(index)
      return setCurrentAudioPlaying(true)
    }

    setButtonActive(null)
  }

  const playAdvancedHandler = (index) => {
    if (index !== buttonActive) {
      switch (index) {
        case 0:
          setCurrentAudio(new Audio(audioRoles))
          break
        case 1:
          setCurrentAudio(new Audio(audioDogovorka))
          break
        case 2:
          if (advanced) {
            setCurrentAudio(new Audio(nextAudio))
            const newNextAudioId = nextAudioId === num ? 0 : nextAudioId + 1
            setNextAudioId(newNextAudioId)
          } else {
            setCurrentAudio(audioNight)
          }
          break
        case 3:
          setCurrentAudio(new Audio(audioBreak))
          break
        default:
          break
      }
      currentAudio && currentAudio.pause()
      setButtonActive(index)
      setCurrentAudioPlaying(true)
    } else {
      currentAudio.pause()
      setCurrentAudioPlaying(false)
      setButtonActive(null)
    }
  }

  const playHandler = (index) => {
    setLastActive(index)
    advanced ? playAdvancedHandler(index) : playSimpleHandler(index)
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <div className="flex gap-5 w-full justify-center">
        {audioArray.slice(0, 2).map((audio) => {
          const { buttonText, index, disabled } = audio
          return (
            <Button
              key={index}
              onClick={() => playHandler(index)}
              disabled={disabled}
              label={buttonText}
              isActive={index === buttonActive}
            />
          )
        })}
      </div>
      <div className="flex gap-5 w-full justify-center">
        {audioArray.slice(2, 4).map((audio) => {
          const { buttonText, index, disabled } = audio
          return (
            <Button
              key={index}
              onClick={() => playHandler(index)}
              disabled={disabled}
              label={buttonText}
              isActive={index === buttonActive}
            />
          )
        })}
      </div>
      <div className="flex gap-5 w-full justify-center">
        <Button
          disabled={!currentAudio}
          onClick={() => {
            if (!currentAudio) return

            setCurrentAudioPlaying(!currentAudioPlaying)

            if (currentAudio.paused) {
              currentAudio.play()
              return setButtonActive(lastActive)
            }

            currentAudio.pause()
            setButtonActive(null)
          }}
          label={currentAudioPlaying || !currentAudio ? 'Пауза' : 'Играть'}
        />
        <Button
          disabled={!currentAudio}
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
