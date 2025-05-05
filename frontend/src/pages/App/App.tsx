import './style.scss'
import CentralArea from '@frames/CentralArea/CentralArea'
import RightPanel from '@frames/RightPanel/RightPanel'
import LeftPanel from '@frames/LeftPanel/LeftPanel'
import Сurtain from '@comps/Сurtain/Сurtain'

function PageApp() {
    return (
        <>
            <LeftPanel />
            <CentralArea />
            <RightPanel />
            <Сurtain />
        </>
    )
}

export default PageApp
