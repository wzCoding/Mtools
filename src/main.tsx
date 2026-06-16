import 'virtual:svg-icons-register'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './theme.less'
import '@/i18n'
import App from './App.tsx'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
