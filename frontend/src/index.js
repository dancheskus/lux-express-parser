import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.scss';
import './main.scss';
import App from './App';

import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

const store = configureStore();

const jsx = (
  <Provider store={store}>
    <App />
  </Provider>
);

ReactDOM.render(jsx, document.getElementById('root'));
