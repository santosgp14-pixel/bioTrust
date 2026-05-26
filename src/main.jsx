import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from '../bioequip.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
