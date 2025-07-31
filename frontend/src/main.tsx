import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@pages/reset.css'
import '@pages/colors.scss'
import ProtectedRoute from '@pages/ProtectedRoute'
import Sus from '@pages/Sus/Sus'

// import Auth from '@pages/Auth/Auth'
const Auth = lazy(() => import('@pages/Auth/Auth'))

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/sus" element={<Sus />} />
                    <Route path="/" element={<ProtectedRoute />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    </StrictMode>
)
