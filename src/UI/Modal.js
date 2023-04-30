import * as React from 'react'
import Box from '@mui/material/Box'
import { Modal as MUIModal, Fade } from '@mui/material/'
import { Switch } from '@mui/material'

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

export const Modal = ({ modal, onClose, advanced, setAdvanced }) => {
  const closeHandler = () => onClose(false)

  const onChangeHandler = () => {
    const newValue = !advanced
    localStorage.setItem('advanced', newValue)
    setAdvanced(newValue)
  }

  return (
    <>
      <MUIModal
        open={modal}
        onClose={closeHandler}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Fade in={modal}>
          <Box sx={style} className="modal-body">
            <div className="modal-text">Simple player</div>
            <Switch
              checked={advanced}
              onChange={onChangeHandler}
              inputProps={{ 'aria-label': 'controlled' }}
            />
            <div className="modal-text">Piano loop</div>
          </Box>
        </Fade>
      </MUIModal>
    </>
  )
}
