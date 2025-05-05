import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { themeWithStorageAtom } from '@utils/jotai.store';
import './style.scss';

function ThemeToggle() {
    const [theme, setTheme] = useAtom(themeWithStorageAtom);

    const handleThemeChange = (newTheme: 'light' | 'auto' | 'dark') => {
        setTheme(newTheme);
    };

    // синхронизация с prefers-color-scheme и классом .dark-theme
    useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            const isDark = mediaQuery.matches;
            document.documentElement.classList.toggle('dark-theme', theme === 'dark' || (theme === 'auto' && isDark));
        };

        handleChange();
        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme]);

    return (
        <div className="theme-toggle" role="radiogroup" aria-label="Theme switcher">
            <div
                className={`theme-toggle__option ${theme === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeChange('light')}
                role="radio"
                aria-checked={theme === 'light'}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleThemeChange('light')}
                >
                <span>Light</span>
            </div>

            <div
                className={`theme-toggle__option ${theme === 'auto' ? 'active' : ''}`}
                onClick={() => handleThemeChange('auto')}
                role="radio"
                aria-checked={theme === 'auto'}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleThemeChange('auto')}
                >
                <span>Auto</span>
            </div>

            <div
                className={`theme-toggle__option ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeChange('dark')}
                role="radio"
                aria-checked={theme === 'dark'}
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleThemeChange('dark')}
                >
                <span>Dark</span>
            </div>

            <div className="theme-toggle__indicator" data-theme={theme}><span>{theme.charAt(0).toUpperCase() + theme.slice(1)}</span></div>
        </div>
    );
}

export default ThemeToggle;