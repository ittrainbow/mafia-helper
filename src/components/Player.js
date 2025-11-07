import { getDownloadURL, getStorage, ref } from 'firebase/storage'
import { useEffect, useState } from 'react'

import { app } from '../db/firebase'
import { Button } from '../UI/Button'

const num = 18

export const Player = ({ advanced }) => {
  const storage = getStorage(app)
  console.log(123, storage)
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
    // {
    //   index: 2,
    //   label: 'Night',
    //   setter: setAudioNight,
    //   disabled: advanced ? !nextAudio : !audioNight
    // }
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
    if (array && nextAudioId) {
      const url = `gs://circle-38cc7.appspot.com/${array[nextAudioId]}.mp3`
      getDownloadURL(ref(storage, url)).then((response) => setNextAudio(response))
    }
    // eslint-disable-next-line
  }, [nextAudioId, array])

  useEffect(() => {
    if (currentAudio) {
      currentAudio.play()
      currentAudio.loop = true
    }
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
      setCurrentAudioPlaying(true)
    } else {
      setButtonActive(null)
      // setCurrentAudio(null)
    }
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

  const pauseHandler = () => {
    if (currentAudio) {
      setCurrentAudioPlaying(!currentAudioPlaying)
      if (currentAudio.paused) {
        currentAudio.play()
        setButtonActive(lastActive)
      } else {
        currentAudio.pause()
        setButtonActive(null)
      }
    }
  }

  const stopHandler = () => {
    if (currentAudio) {
      currentAudio.pause()
      setCurrentAudio(null)
      setButtonActive(null)
    }
  }

  return (
    <div className="buttons-container">
      <div className="buttons">
        {audioArray.slice(0, 2).map((audio) => {
          const { buttonText, index, disabled } = audio
          const getClass = () => (index === buttonActive ? 'button-active' : 'button')
          return (
            <Button
              key={index}
              className={getClass()}
              onClick={() => playHandler(index)}
              disabled={disabled}
              label={buttonText}
            />
          )
        })}
      </div>
      <div className="buttons">
        {audioArray.slice(2, 4).map((audio) => {
          const { buttonText, index, disabled } = audio
          const getClass = () => (index === buttonActive ? 'button-active' : 'button')
          return (
            <Button
              key={index}
              className={getClass()}
              onClick={() => playHandler(index)}
              disabled={disabled}
              label={buttonText}
            />
          )
        })}
      </div>
      <div className="buttons">
        <Button
          className="button"
          disabled={!currentAudio}
          onClick={pauseHandler}
          label={currentAudioPlaying || !currentAudio ? 'Пауза' : 'Играть'}
        />
        <Button className="button" disabled={!currentAudio} onClick={stopHandler} label="Стоп" />
      </div>
    </div>
  )
}
