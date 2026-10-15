import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { store } from './store/store'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#171717',
              color: '#F5F2EA',
              border: '1px solid rgba(212,175,55,0.2)',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#D4AF37', secondary: '#080808' },
            },
            error: {
              iconTheme: { primary: '#C0392B', secondary: '#F5F2EA' },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
)
