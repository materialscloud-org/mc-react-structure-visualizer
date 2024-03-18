import React from 'react';
import ReactDOM from 'react-dom/client';

// Note: Bootstrap is not really used.
// Just the default css is loaded to test how the component works with bootstrap.
import "bootstrap/dist/css/bootstrap.min.css";

import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
