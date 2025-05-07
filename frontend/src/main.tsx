import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@pages/reset.css'
import '@pages/colors.scss'
import PageApp from '@pages/App/App'
import '@comps/Toggle/Toggle.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PageApp />
  </StrictMode>,
)
