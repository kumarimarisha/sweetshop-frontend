import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#ff9800', // Orange
      light: '#ffb74d',
      dark: '#e65100',
    },
    secondary: {
      main: '#ff6f00', // Deep Orange
      light: '#ffb74d',
      dark: '#bf360c',
    },
    background: {
      default: '#fffbf0',
      paper: '#ffffff',
    },
    text: {
      primary: '#3e2723',
      secondary: '#795548',
    },
  },
});


export default theme;
