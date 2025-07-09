import { TypeTasks_SubTask } from '@mytype/typeTask'

import CheckBoxTask from '@comps/CheckBox/CheckBoxTask'

type BlockSubTaskProps = {
    subtask: TypeTasks_SubTask
    onChangeStatus: () => void
}

function BlockSubTask ({subtask, onChangeStatus}:BlockSubTaskProps) {
    
    return (
        <div className="task-item__subtask">
            <CheckBoxTask 
                state={subtask.status} 
                onChangeStatus={onChangeStatus}
            />
            <div className="task-item__subtask-title">{subtask.title}</div>
            <div className="task-item__subtask-description">{subtask.description}</div>
            <div className="task-item__subtask-motivation">{subtask.motivation}</div>
            <div className="task-item__subtask-instruction">{subtask.instruction}</div>
            <div className="task-item__subtask-continuance">
                {subtask.continuance} hour{1 < subtask.continuance ? "s" : ""}
            </div>
        </div>
    )
}

export default BlockSubTask