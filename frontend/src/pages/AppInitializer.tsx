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

    useEffect(() => {
        // активация заданной темы
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
        setInitialized(true)
    }, [])

    // === Правила редиректов ===
    useEffect(() => {
        // правила редиректов
        if (!initialized || isAuthenticated === null) return

        if (!isAuthenticated && location.pathname !== "/auth") {
            navigate("/auth", { replace: true })
        } else if (isAuthenticated && location.pathname === "/auth") {
            navigate("/", { replace: true })
        }
    }, [initialized, isAuthenticated, location.pathname, navigate])

    // во время проверки авторизации пользователя показывается страница загрузки
    if (!initialized || isAuthenticated === null) {
        return <SuspensePage />
    }

    return children
}

export default AppInitializer
