import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
//import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './components/store';
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
   <Provider store={configureStore()}>
    <App />
    </Provider>
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
