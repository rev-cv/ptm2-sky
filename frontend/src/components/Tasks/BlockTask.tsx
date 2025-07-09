import { useState } from 'react'

import { updateTask } from '@api/updateTask'
import { removeTask } from '@api/removeTask'

import { TypeViewTask } from '@mytype/typeTask'
import { formatDateString } from '@utils/date-funcs'
import { taskChangeDetector } from '@utils/task-change-detector'
import './style.scss'

import BlockSubTask from './BlockSubTask'
import ModalEditorTask from '@comps/EditorTask/EditorTask'

import IcoStart from '@asset/start.svg'
import IcoRisk from '@asset/risk.svg'
import IcoImpact from '@asset/impact.svg'
import IcoFilters from '@asset/filter.svg'

import riskImpact from '@api/BlockCriticalityValues.json'

type TaskProps = {
    objTask: TypeViewTask;
}

function Task({objTask} : TaskProps) {
    const [isOpenEditorTask, setIsOpenEditorTask] = useState(false)
    const [isOpenSubTasks, setIsOpenSubTasks] = useState(false)

    const deadline = objTask.deadline ? new Date(objTask.deadline) : null;
    const deadlaneDiff = deadline ? Math.floor((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24) + 1) : null;
    const deadlineClass = deadlaneDiff != null && 
        deadlaneDiff < 1 ? "day_1" 
        : deadlaneDiff && deadlaneDiff < 3 ? "days_3"
        : deadlaneDiff && deadlaneDiff < 7 ? "week_1"
        : deadlaneDiff && deadlaneDiff < 14 ? "week_2"
        : "in_near_future"

    const isFail = deadline && deadline < new Date()

    const activation = objTask.activation ? new Date(objTask.activation) : null;

    const riskValue = getRiskImpactValue("risk", objTask.risk);
    const impactValue = getRiskImpactValue("impact", objTask.impact);

    const countFilters = getCountFilters()

    const [doneSubTasksCount, waitSubTasksCount] = objTask.subtasks.reduce((prev, cur) => 
	    cur.status ? [prev[0] + 1, prev[0]] : [prev[0], prev[1] + 1], [0, 0]
    )

    function getCountFilters () {
        return (objTask?.filters.theme?.length || 0) +
            (objTask?.filters.stress?.length || 0) +
            (objTask?.filters.action_type?.length || 0) +
            (objTask?.filters.state
                ? Object.values(objTask.filters.state).reduce((sum, arr) => sum + (arr?.length || 0), 0)
                : 0)
    }

    function getRiskImpactValue (arg1: string, arg2: number) {
        if (arg1 === "risk") {
            const riskValue = riskImpact?.risk.find(item => item.value === arg2);
            return riskValue ? riskValue : null;
        } else if (arg1 === "impact") {
            const impactValue = riskImpact?.impact.find(item => item.value === arg2);
            return impactValue ? impactValue : null;
        }
        return null;
    }

    return (<>
    
    <div 
        className={`task-item${objTask.status ? " task-done" : isFail ? " task-fail" : ""}`}
        onClick={() => setIsOpenEditorTask(true)}
        >
        <div className="task-item__title">{objTask.title}</div>

        {(0 < objTask.description.trim().length) ?
            <div className="task-item__descr">{objTask.description}</div> : null
        }

        {(0 < objTask.motivation.trim().length) ?
            <div className="task-item__descr">{objTask.motivation}</div> : null
        }
        
        {(riskValue && 0 < riskValue.value ) &&
            <div className={`task-item__descr`}>
                <IcoRisk /> <span>{riskValue.description}</span>
            </div>
        }
        {(impactValue && 0 < impactValue.value ) &&
            <div className={`task-item__descr`}>
                <IcoImpact /> <span>{impactValue.description}</span>
            </div>
        }
        {0 < countFilters &&
            <div className={`task-item__descr`}><span>
                <IcoFilters /> 
                {Object.entries(objTask.filters).map(([key, filter]) => {
                    if (Array.isArray(filter) && filter.length) {
                        return filter.map((f) => (
                            <button
                                onClick={e => {
                                    e.stopPropagation()
                                }}
                                >#{f.name}
                            </button>
                        ))
                    }
                    if (key === "state" && typeof filter === "object" && filter !== null) {
                        return Object.entries(filter).map(([, subArr]) =>
                            Array.isArray(subArr) && subArr.length ? (
                                subArr.map((f) => (
                                    <button
                                        onClick={e => {
                                            e.stopPropagation()
                                        }}
                                        >#{f.name}
                                    </button>
                                ))
                            ) : null
                        )
                    }
                    return null
                })}
            </span></div>
        }
        {objTask.activation &&
            <div className={`task-item__descr`}>
                <IcoStart />
                { activation ? <span>{formatDateString(activation)}</span> : "" }
            </div>
        }
        {objTask.deadline &&
            <div className={`task-item__descr ${deadlineClass} dl`}>
                <IcoStart />
                { deadline ? <span>{formatDateString(deadline)}</span> : "" }
                { deadlaneDiff != null ? <span className='days'> {`(${deadlaneDiff} days)`}</span> : "" }
            </div>
        }

        { (0 < objTask.subtasks.length) && <>
            <div className={`task-item__subtasks-btn`}>
                <button
                    onClick={e => {
                        e.stopPropagation()
                        setIsOpenSubTasks(!isOpenSubTasks)
                    }}
                    ><span>{`${doneSubTasksCount} / ${objTask.subtasks.length}`}</span> подзадач
                </button>
            </div>
            <div className={`task-item__subtask-extender${isOpenSubTasks ? " view" : ""}`}>
                <div>
                    { objTask.subtasks?.map((subtask, index) => (
                        <BlockSubTask 
                            key={`task-subtask-id${index}`} 
                            subtask={subtask}
                            onChangeStatus={() => {
                                const st = objTask.subtasks.map(elem => 
                                    elem.id === subtask.id ? {...elem, status: !elem.status} : elem
                                )
                                updateTask({...objTask, subtasks: st})
                            }}
                        />
                    ))}
                </div>
            </div>
        </>}
    </div>

    { isOpenEditorTask ? 
        // отображение модального окна для задачи
        <ModalEditorTask 
            originakTask={objTask}
            onExit={updatedTask => {
                setIsOpenEditorTask(false)
                if (taskChangeDetector(updatedTask)) {
                    setTimeout(() => updateTask(updatedTask), 400)
                }
            }}
            onDelete={() => {
                removeTask(objTask.id)
                setIsOpenEditorTask(false)
            }}
        />
    : null }
    </>)
}

export default Task