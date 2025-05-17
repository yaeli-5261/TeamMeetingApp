
// import './App.css'
// import Manager from './components/Manager'

// function App() {

//   return (
//     <>
//         <Manager></Manager>
//     </>
//   )
// }

// export default App


import { RouterProvider } from "react-router-dom"
import { router } from "./router"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { Provider } from "react-redux"
import store from "./store/store"

// Create a theme instance with OpenAI-like styling
const theme = createTheme({
  palette: {
    primary: {
      main: "#10a37f", // OpenAI green
    },
    background: {
      default: "#f7f7f8", // Light gray background
      paper: "#ffffff",
    },
    text: {
      primary: "#202123", // Dark gray for text
      secondary: "#6e6e80", // Medium gray for secondary text
    },
    divider: "rgba(0, 0, 0, 0.1)",
  },
  typography: {
    fontFamily: '"Söhne", "Helvetica Neue", Helvetica, Arial, sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.05)",
        },
      },
    },
  },
})

function App() {
  return (
    <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
    </Provider>
  )
}

export default App

