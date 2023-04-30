import React from 'react'
import { Button as MUIButton } from '@mui/material'
import { ThemeProvider } from '@mui/system'

import { darkTheme } from './theme'

export const Button = ({ onClick, className, disabled, label }) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <MUIButton
        variant="outlined"
        className={className}
        onClick={onClick}
        disabled={disabled}
        sx={{
          cursor: 'pointer',
          '&.Mui-disabled': {
            background: '#484c53',
            color: '#ddd'
          }
        }}
      >
        {label}
      </MUIButton>
    </ThemeProvider>
  )
}
