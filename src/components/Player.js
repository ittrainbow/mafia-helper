import React, { useState, useEffect } from 'react'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'

import { app } from '../db/firebase'
import { Button } from '../UI/Button'

const num = 18

export const Player = ({ advanced }) => {
  const storage = getStorage(app)

  const [audioMafia, setAudioMafia] = useState(null)
  const [audioRoles, setAudioRoles] = useState(null)
  const [audioNight, setAudioNight] = useState(null)
  const [nextAudio, setNextAudio] = useState(null)
  const [nextAudioId, setNextAudioId] = useState(null)
  const [buttonActive, setButtonActive] = useState(null)
  const [lastActive, setLastActive] = useState(null)
  const [currentAudioPlaying, setCurrentAudioPlaying] = useState(false)
  const [currentAudio, setCurrentAudio] = useState(null)

  const [array, setArray] = useState([])

  const audioArray = [
    { index: 0, label: 'Mafia', setter: setAudioMafia, disabled: !audioMafia },
    { index: 1, label: 'Roles', setter: setAudioRoles, disabled: !audioRoles },
    {
      index: 2,
      label: 'Night',
      setter: setAudioNight,
      disabled: advanced ? !nextAudio : !audioNight
    }
  ]

  useEffect(() => {
    audioArray.forEach((audio) => {
      const { label, setter } = audio
      const url = `gs://circle-38cc7.appspot.com/${label}.mp3`
      getDownloadURL(ref(storage, url)).then((response) => setter(response))
    })

    const array = Array.from(Array(num).keys()).sort((a, b) => 0.5 - Math.random())
    const url = `gs://circle-38cc7.appspot.com/${array[num - 1]}.mp3`
    getDownloadURL(ref(storage, url)).then((response) => {
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
            return new Audio(audioMafia)
          case 1:
            return new Audio(audioRoles)
          case 2:
            return new Audio(audioNight)
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
          setCurrentAudio(new Audio(audioMafia))
          break
        case 1:
          setCurrentAudio(new Audio(audioRoles))
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
        {audioArray.map((audio) => {
          const { label, index, disabled } = audio
          const getClass = () => (index === buttonActive ? 'button-active' : 'button')
          return (
            <Button
              key={index}
              className={getClass()}
              onClick={() => playHandler(index)}
              disabled={disabled}
              label={label}
            />
          )
        })}
      </div>
      <div className="buttons">
        <Button
          className="button"
          disabled={!currentAudio}
          onClick={pauseHandler}
          label={currentAudioPlaying || !currentAudio ? 'Pause' : 'Resume'}
        />
        <Button className="button" disabled={!currentAudio} onClick={stopHandler} label="Stop" />
      </div>
    </div>
  )
}
