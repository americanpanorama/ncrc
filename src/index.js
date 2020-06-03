import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Store from './store/index.js';
import App from './App.js';

render(
  <Provider store={Store}>
    <App />
  </Provider>,
  document.getElementById('app-container'),
);
