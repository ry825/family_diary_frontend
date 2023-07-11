import logo from './logo.svg';
import './App.css';
import NavBar from './components/NavBar';
import Main from './components/Main';
import HandleAxiosError from './components/HandleAxiosError'
import { createTheme, ThemeProvider } from '@mui/material/styles';

import ApiContextProvider from './context/ApiContext';

const theme = createTheme({
  palette: {
    primary:{
      main:'#bbdefb'
    },
    secondary: {
      main:'#00bcd4'
    }
  }
});

function App() {

  return (
    <ApiContextProvider>
      <ThemeProvider theme={theme}>
        <HandleAxiosError />
        <NavBar />
        <Main />
      </ThemeProvider>
    </ApiContextProvider>
  );
}

export default App;
