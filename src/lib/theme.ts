import { createTheme } from "@mui/material"

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f9f9f9',
    },
    primary: {
      main: '#1976d2', // biru default MUI
    },
    secondary: {
      main: '#9c27b0',
    },
  },
  shape: {
    borderRadius: 5,
  },
  typography: {
    fontFamily: ['Poppins', 'sans-serif'].join(','),
  },
})

export default theme