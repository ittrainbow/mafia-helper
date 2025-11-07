import { Switch } from '@mui/material'
import { Fade, Modal as MUIModal } from '@mui/material/'
import Box from '@mui/material/Box'
import { ThemeProvider } from '@mui/system'

import { darkTheme } from './theme'

import { Button } from './Button'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

export const Modal = ({ modal, onClose, advanced, setAdvanced, bells, setBells }) => {
  const closeHandler = () => onClose(false)

  const onChangeLoopHandler = () => {
    const newValue = !advanced
    localStorage.setItem('advanced', newValue)
    setAdvanced(newValue)
  }

  const onChangeBellHandler = () => {
    const newValue = !bells
    localStorage.setItem('bells', newValue)
    setBells(newValue)
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <MUIModal
        className="modal"
        open={modal}
        onClose={closeHandler}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Fade in={modal}>
          <Box sx={style} className="modal-container">
            <div className="modal-switch">
              {/* <div className="modal-text">Мелодия</div> */}
              <div className="modal-text">Фортепиано</div>
              <Switch checked={advanced} onChange={onChangeLoopHandler} inputProps={{ 'aria-label': 'controlled' }} />
            </div>
            <div className="modal-switch flexcol">
              {/* <div className="modal-text">Bells off</div> */}
              <div className="modal-text">Уведомления</div>
              <Switch checked={bells} onChange={onChangeBellHandler} inputProps={{ 'aria-label': 'controlled' }} />
            </div>
            <Button onClick={() => onClose(false)} className="modal-button button" label="OK" />
          </Box>
        </Fade>
      </MUIModal>
    </ThemeProvider>
  )
}
