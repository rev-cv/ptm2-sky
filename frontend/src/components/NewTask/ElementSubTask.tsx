import { TypeSubTask } from '@mytype/typesNewTask'
import IcoSubTaskPoint from '@asset/task_point.svg'

function SubTask ({title="", description="", instruction="", continuance=0, motivation=""}: TypeSubTask) {

    return (
        <div className="new-task__subtask">
            <div className='new-task__subtask-title'><IcoSubTaskPoint />{title}</div>
            <div className='new-task__subtask-motiv'>{motivation}</div>
            <div className='new-task__subtask-descr'>{description}</div>
            <div className='new-task__subtask-instr'>{instruction}</div>
            <div className='new-task__subtask-hours'>Время выполнения: {continuance}h</div>
        </div>
        
    )
}

export default SubTask