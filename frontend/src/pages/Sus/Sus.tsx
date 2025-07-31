import './style.scss'
import { useEffect } from 'react'
import Loader from '@comps/Loader/Loader'
// import IcoPTM from '@asset/ptm.svg'
import { useAtomValue, themeWithStorageAtom } from '@utils/jotai.store'


function SuspensePage () {

    const theme = useAtomValue(themeWithStorageAtom)

    // синхронизация с prefers-color-scheme и классом .dark-theme
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

    return <div className={`suspense-page ${theme}`}>
        {/* <IcoPTM /> */}
        <span><Loader /></span>
        
    </div>
}

export default SuspensePage