import { useAtom } from 'jotai'
import { openSidePanel, themeAtom } from '@utils/jotai.store'
import { useEffect } from "react";

function CentralArea() {
    const [, setPanel] = useAtom(openSidePanel)
    const [theme, setTheme] = useAtom(themeAtom);

    // Инициализация темы при загрузке
    useEffect(() => {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark-theme', theme === 'dark' || (theme === 'auto' && isDark));
    }, [theme]);

    const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
        setTheme(newTheme);
        // Применяем класс к <html> для переключения темы
        document.documentElement.classList.toggle('dark-theme', newTheme === 'dark' || (newTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches));
    };

    return (
        <div className="frame-central">
            <button onClick={() => setPanel("left")}>left</button>
            <button onClick={() => setPanel("right")}>right</button>
            <button onClick={() => setPanel("setting")}>setting</button>
        </div>
    )
}

export default CentralArea