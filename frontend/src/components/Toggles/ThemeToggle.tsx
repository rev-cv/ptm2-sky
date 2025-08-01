import { useAtom, themeWithStorageAtom } from '@utils/jotai.store'
import './style.scss'

function ThemeToggle() {
    const [theme, setTheme] = useAtom(themeWithStorageAtom)

    const handleThemeChange = (newTheme: 'light' | 'auto' | 'dark') => {
        setTheme(newTheme)
    }

    return (
        <div className="toggle" role="radiogroup" aria-label="Theme switcher">
            <div
                className={`toggle__option ${theme === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeChange('light')}
                role="radio"
                aria-checked={theme === 'light'}
                tabIndex={0}
                >
                <span>Light</span>
            </div>

            <div
                className={`toggle__option ${theme === 'auto' ? 'active' : ''}`}
                onClick={() => handleThemeChange('auto')}
                role="radio"
                aria-checked={theme === 'auto'}
                tabIndex={0}
                >
                <span>System</span>
            </div>

            <div
                className={`toggle__option ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeChange('dark')}
                role="radio"
                aria-checked={theme === 'dark'}
                tabIndex={0}
                >
                <span>Dark</span>
            </div>
        </div>
    )
}

export default ThemeToggle