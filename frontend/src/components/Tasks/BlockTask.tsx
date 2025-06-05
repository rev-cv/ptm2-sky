import { TypeViewTask } from '@mytype/typeTask'
import './style.scss'

type TaskProps = {
    objTask: TypeViewTask;
    className?: string;
}

function Task({objTask, className = ""} : TaskProps) {

    return (<div className={`task-list__item ${className}`}>
        <div className="task-list__item__title">{objTask.title}</div>
        <div className="task-list__item__description">{objTask.description}</div>
    </div>)
}

export default Task