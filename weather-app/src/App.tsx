import './App.css';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { StyledEngineProvider } from '@mui/material';
import router from './router.tsx';
import theme from './theme/index';
import { WeatherProvider } from './contexts/WeatherContext';

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <WeatherProvider>
          <RouterProvider router={router} />
        </WeatherProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
