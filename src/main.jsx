import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { XPProvider } from './contexts/XPContext'
import { AudioProvider } from './contexts/AudioContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <XPProvider>
          <AudioProvider>
            <App />
          </AudioProvider>
        </XPProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
) 