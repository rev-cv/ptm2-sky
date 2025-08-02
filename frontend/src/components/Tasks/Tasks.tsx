import './style.scss'
import { useAtomValue, atomViewTasks, atomViewTasksAllCount, atomSamplingStatus} from '@utils/jotai.store'
import BlockTask from './BlockTask'
import Button from '@comps/Button/Button'

import Loader from '@comps/Loader/Loader'
import Nothing from '@asset/sad-kitten.svg'

import { loadTasks } from '@api/loadTasks2'

function Tasks() {

    const tasks = useAtomValue(atomViewTasks)
    const count = useAtomValue(atomViewTasksAllCount)
    const status = useAtomValue(atomSamplingStatus)

    if (tasks.length === 0 && status != "loading" ) {
        // ничего не найдено
        return <div className="task-list-nothing">
            <Nothing />
            <div>nothing found</div>
        </div>
    }

    return (
        <div className="task-list">
            { tasks.map((task, index) => 
                <BlockTask 
                    key={`task-viewed-${task.id}`} 
                    objTask={task} 
                    index={index}
                /> 
            )}

            {
                (tasks.length === 0 && status === "loading" ) ?
                    <div className="task-list-loader"><Loader /></div>
                    : null
            }

            {
                count - tasks.length != 0 ?

                    <div className='task-list__pagination'>
                        <Button 
                            text={"show more"} 
                            variant="second" 
                            onClick={() => loadTasks(false)}
                        />
                    </div> : null
            }
        </div>
    )
}

export default Tasks