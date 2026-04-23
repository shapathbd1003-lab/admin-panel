import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3500,
        style: {
          borderRadius: '10px',
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
        },
        success: { iconTheme: { primary: '#2E7D32', secondary: '#fff' } },
        error:   { iconTheme: { primary: '#C62828', secondary: '#fff' } },
      }}
    />
  </React.StrictMode>
)
