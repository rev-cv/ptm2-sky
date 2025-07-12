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
            {subtask.description &&
                <div className="task-item__subtask-description">{subtask.description}</div>
            }
            {subtask.motivation &&
                <div className="task-item__subtask-motivation">{subtask.motivation}</div>
            }
            {subtask.instruction &&
                <div className="task-item__subtask-instruction">{subtask.instruction}</div>
            }
            {(subtask.continuance && 0 < subtask.continuance) ?
                <div className="task-item__subtask-continuance">
                    {subtask.continuance} hour{1 < subtask.continuance ? "s" : ""}
                </div> : null
            }
        </div>
    )
}

export default BlockSubTask