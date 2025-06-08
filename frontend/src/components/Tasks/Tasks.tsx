import './style.scss'
import { useAtomValue, viewTasks} from '@utils/jotai.store'
import BlockTask from './BlockTask'

function Tasks() {

    const tasks = useAtomValue(viewTasks)

    return (<div className="task-list">
        { tasks.map((task) => <BlockTask key={task.id} objTask={task} /> ) }
    </div>)
}

export default Tasks