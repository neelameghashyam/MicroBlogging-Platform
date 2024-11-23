import { BrowserRouter } from 'react-router-dom'
import AuthProvider from '../src/MIcro-Blog-App/components/AuthProvider';

import React from 'react';
import ReactDOM from 'react-dom/client';

import App from '../src/MIcro-Blog-App/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
 
 );
