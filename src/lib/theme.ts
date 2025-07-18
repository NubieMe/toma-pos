import { createTheme, PaletteMode } from "@mui/material"

const theme = (mode: PaletteMode) => createTheme({
  palette: {
    mode, // Gunakan mode yang diterima dari parameter
    // Atur warna yang berbeda untuk light dan dark mode
    ...(mode === 'light'
      ? {
          primary: {
            main: '#1976d2',
          },
          background: {
            default: '#f0f2f5', // Latar belakang utama off-white
            paper: '#ffffff',   // Card dan menu tetap putih bersih
          },
          text: {
            primary: '#1c1e21', // Teks abu-abu gelap
            secondary: '#65676b', // Teks sekunder
          }
        }
      : {
          primary: {
            main: '#1976d2', // Biru cerah untuk interaksi
          },
          secondary: {
            main: '#9c27b0', // Bisa disesuaikan
          },
          background: {
            default: '#1e1f22', // Latar belakang utama
            paper: '#2a2b2e',   // Latar belakang untuk card/menu
          },
          text: {
            primary: '#e1e3e6', // Teks utama
            secondary: '#9aa0a6', // Teks sekunder
          },
        }),
    // secondary: {
    //   main: '#9c27b0',
    // },
  },
  shape: {
    borderRadius: 5,
  },
  typography: {
    fontFamily: ['Poppins', 'sans-serif'].join(','),
  },
  components: {
    MuiTextField: {
      defaultProps: {
        autoComplete: 'off',
        variant: 'standard',
      }
    },
    MuiSelect: {
      defaultProps: {
        variant: 'standard',
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
      defaultProps: {
        variant: 'contained',
      }
    },
    MuiIcon: {
      defaultProps: {
        sx: {
          fontSize: '1.1rem'
        }
      },
    }
  }
})

export default theme