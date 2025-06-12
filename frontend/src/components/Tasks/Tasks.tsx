import './style.scss'
import { useAtomValue, viewTasks, samplingStatus} from '@utils/jotai.store'
import BlockTask from './BlockTask'

import Loader from '@comps/Loader/Loader'
import Nothing from '@asset/sad-kitten.svg'

function Tasks() {

    const tasks = useAtomValue(viewTasks)
    const status = useAtomValue(samplingStatus)

    if (tasks.length === 0 && status === "loading" ) {
        // выполняется чистая загрузка с удалением
        return <div className="task-list-loader"><Loader /></div>
    }

    if (tasks.length === 0 ) {
        // ничего не найдено
        return <div className="task-list-nothing">
            <Nothing />
            <div>nothing found</div>
        </div>
    }

    return (
        <div className="task-list">
            { tasks.map((task) => 
                <BlockTask key={`task-viewed-${task.id}`} objTask={task} /> 
            ) }
        </div>
    )
}

export default Tasks