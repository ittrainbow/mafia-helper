import React from 'react'
import SettingsIcon from '@mui/icons-material/Settings'

export const Settings = ({ showModalHandler, modal }) => {
  const getClassName = () => (modal ? 'settings-button-pressed' : 'settings-button')

  return (
    <div className="settings">
      <SettingsIcon
        fontSize="large"
        className={getClassName()}
        onClick={() => showModalHandler(true)}
      />
    </div>
  )
}
