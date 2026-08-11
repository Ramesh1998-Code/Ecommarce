import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom"
import { store } from './store.js';
import {Provider}  from 'react-redux';
import { StrictMode } from "react";
import { Auth0Provider } from "@auth0/auth0-react";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <StrictMode>
    <Auth0Provider
      domain="dev-dh5qdileedh7q64j.us.auth0.com"
      clientId="RKW1L40a3yZhCByAL9LcLt04UTBY2Y38"
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      cacheLocation="localstorage"
    >
  <Provider store={store}>
    <BrowserRouter>
     <React.StrictMode>
    <App />
  </React.StrictMode>
  </BrowserRouter>
  </Provider>
    </Auth0Provider>
  </StrictMode>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
