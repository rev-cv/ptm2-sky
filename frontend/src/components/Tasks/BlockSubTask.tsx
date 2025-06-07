import { TypeTasks_SubTask } from '@mytype/typeTask'

import CheckBoxTask from '@comps/CheckBox/CheckBoxTask'

type BlockSubTaskProps = {
    subtask: TypeTasks_SubTask
}

function BlockSubTask ({subtask}:BlockSubTaskProps) {
    
    return (
        <div className="task-list__item__subtask">
            <CheckBoxTask state={true} />
            <div className="task-list__item__subtask-title">{subtask.title}</div>
            <div className="task-list__item__subtask-description">{subtask.description}</div>
            <div className="task-list__item__subtask-motivation">{subtask.motivation}</div>
            <div className="task-list__item__subtask-instruction">{subtask.instruction}</div>
            <div className="task-list__item__subtask-continuance">Continuance: {subtask.continuance} hours</div>
        </div>
    )
}

export default BlockSubTask