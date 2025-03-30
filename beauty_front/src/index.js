import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
//import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './components/store';
import { createTheme, ThemeProvider } from '@mui/material/styles';
const root = ReactDOM.createRoot(document.getElementById('root'));


const theme = createTheme({
  palette: {
      primary: {
          main: '#E07BFF', // Измените здесь на ваш основной цвет
      },
      secondary: {
          main: '#dc004e', // Измените здесь на ваш вторичный цвет
      },
  },
});


root.render(
  <React.StrictMode>
     <ThemeProvider theme={theme}>
        <Provider store={configureStore()}>
          <App />
          </Provider>
    </ThemeProvider>
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err))
  })
}
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
