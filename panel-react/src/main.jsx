import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ArticulosProvider } from './context/ArticulosContext.jsx';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ArticulosProvider>
          <App />
        </ArticulosProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
