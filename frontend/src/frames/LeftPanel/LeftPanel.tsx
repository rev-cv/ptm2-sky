import { useAtomValue } from 'jotai'
import { openSidePanel } from '@utils/jotai.store'
import NewTask from '@comps/NewTask/NewTask'
import './style.scss'

function LeftPanel() {
    const currentOpenPanel = useAtomValue(openSidePanel)

    return (<div className={`frame-left${currentOpenPanel !== "left" ? " hide" : ""} new-task`}>
        <div className="frame-left__h3">New Task</div>

        <NewTask />  
    </div>)
}

export default LeftPanel