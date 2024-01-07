import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './AuthContext';
import { FollowerUpdateProvider } from './FollowerUpdateContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider >
      <FollowerUpdateProvider >
        <App />
      </FollowerUpdateProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
