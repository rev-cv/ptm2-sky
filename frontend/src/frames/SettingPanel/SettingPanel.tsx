import { useAtomValue, openSidePanel } from '@utils/jotai.store'
import ThemeToggle from '@comps/Toggles/ThemeToggle'
import './style.scss'

function SettingPanel() {
    const currentOpenPanel = useAtomValue(openSidePanel)

    return (<div className={`frame-setting${currentOpenPanel !== "setting" ? " hide" : ""}`}>
        <div className="frame-setting__h2">Setting</div>
        <div className="frame-setting__h3">Theme</div>
        <ThemeToggle />
    </div>)
}

export default SettingPanel