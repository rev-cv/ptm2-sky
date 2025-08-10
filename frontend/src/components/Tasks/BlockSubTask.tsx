import { TypeTasks_SubTask } from '@mytype/typeTask'

import CheckBoxTask from '@comps/CheckBox/CheckBoxTask'
import MarkDown from '@comps/MarkDown/MarkDown'

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
                <MarkDown className="task-item__subtask-description" markdown={subtask.description}/>
            }
            {subtask.motivation &&
                <MarkDown className="task-item__subtask-motivation" markdown={subtask.motivation}/>
            }
            {subtask.instruction &&
                <MarkDown className="task-item__subtask-instruction" markdown={subtask.instruction}/>
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