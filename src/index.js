/* istanbul ignore file */
// ignore test coverage since this file is just setup with no logic
import 'bootstrap/dist/css/bootstrap.css';

import './index.css';

import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root'),
);
