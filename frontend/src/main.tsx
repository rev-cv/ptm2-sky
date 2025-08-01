import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@pages/reset.css'
import '@pages/colors.scss'

import AppInitializer from '@pages/AppInitializer'
const App = lazy(() => import('@pages/App/App'))
const Sus = lazy(() => import('@pages/Sus/Sus'))
const Auth = lazy(() => import('@pages/Auth/Auth'))

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <AppInitializer>
                <Suspense fallback={<Sus/>}>
                    <Routes>
                        <Route path="/auth" element={<Auth />} />
                        <Route path="/sus" element={<Sus />} />
                        <Route path="/" element={<App />} />
                    </Routes>
                </Suspense>
            </AppInitializer>
        </BrowserRouter>
    </StrictMode>
)
