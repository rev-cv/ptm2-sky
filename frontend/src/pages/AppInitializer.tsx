import { useState, useEffect } from "react"
import { useAtomValue, themeWithStorageAtom, atomIsAuthenticated } from '@utils/jotai.store'
import { useNavigate, useLocation } from "react-router-dom"
import { checkToken } from '@api/authCheckToken'

import SuspensePage from '@pages/Sus/Sus'

type TypeProps = { 
    children: React.ReactNode
}

const AppInitializer = ({ children }:TypeProps) => {
    const [initialized, setInitialized] = useState(false)
    const isAuthenticated = useAtomValue(atomIsAuthenticated)

    const theme = useAtomValue(themeWithStorageAtom)
    const navigate = useNavigate()
    const location = useLocation()

    // === Активация заданной темы
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

        const handleChange = () => {
            const isDark = mediaQuery.matches
            document.documentElement.classList.toggle('dark-theme', theme === 'dark' || (theme === 'auto' && isDark))
        }

        handleChange()
        
        mediaQuery.addEventListener('change', handleChange)

        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [theme])

    // === Аутентификация ===
    useEffect(() => {
        checkToken()
    }, [])

    // === Правила редиректов ===
    useEffect(() => {
        if (isAuthenticated === null) return

        if (!isAuthenticated && location.pathname !== "/auth") {
            navigate("/auth", { replace: true })
        } else if (isAuthenticated && location.pathname === "/auth") {
            navigate("/", { replace: true })
        }

        setInitialized(true)
    }, [initialized, isAuthenticated, location.pathname, navigate])

    if (!initialized || isAuthenticated === null) {
        return <SuspensePage />
    }

    return children
}

export default AppInitializer
