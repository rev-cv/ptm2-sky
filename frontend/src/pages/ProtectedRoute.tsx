const APIURL = import.meta.env.VITE_API_URL
import React, { Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import SuspensePage from '@pages/Sus/Sus'
import { fetchAuth } from '@api/authFetch'

const ProtectedRoute = () => {
    
    const [isAuthenticated, setIsAuthenticated] = useState<boolean|null>(null);

    useEffect(() => {
        const checkToken = async () => {
            // try {
            //     const response = await fetch(`${APIURL}/api/check-token`, {
            //         method: 'GET',
            //         credentials: 'include',
            //     })
            //     if (!response.ok) {
            //         throw new Error('Token check failed')
            //     }
            //     const data = await response.json()
            //     console.log(data.detail)
            //     setIsAuthenticated(data.valid)
            // } catch (error) {
            //     setIsAuthenticated(false)
            // }

            try {
                const response = await fetchAuth(`${APIURL}/api/check-token`, {
                    method: 'GET',
                    credentials: 'include',
                })

                if (response.status === 401 || !response.ok) {
                    setIsAuthenticated(false)
                    throw new Error('Token check failed')
                }
                const data = await response.json()
                setIsAuthenticated(data.valid)
            } catch (error) {
                setIsAuthenticated(false)
            }
        }
        checkToken()
    }, [])

    // Пока проверка не завершена, показываем загрузку
    if (isAuthenticated === null) {
        return <SuspensePage />
    }

    // Ленивая загрузка App только при успешной проверке
    const PageApp = isAuthenticated ? React.lazy(() => import('@pages/App/App')) : null

    return isAuthenticated ? (
        <Suspense fallback={<SuspensePage />}>
            {PageApp && <PageApp />}
        </Suspense>
    ) : (
        <Navigate to="/auth" replace />
    )
}

export default ProtectedRoute