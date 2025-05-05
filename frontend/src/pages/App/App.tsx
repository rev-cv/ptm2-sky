import './style.scss'
import CentralArea from '@frames/CentralArea/CentralArea'
import RightPanel from '@frames/RightPanel/RightPanel'
import LeftPanel from '@frames/LeftPanel/LeftPanel'
import Сurtain from '@comps/Сurtain/Сurtain'
import SettingPanel from '@frames/SettingPanel/SettingPanel'

function PageApp() {
    return (
        <>
            <LeftPanel />
            <CentralArea />
            <RightPanel />
            <SettingPanel />
            <Сurtain />
        </>
    )
}

export default PageApp
