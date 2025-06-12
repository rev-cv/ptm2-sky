import { useState } from 'react'

import { TypeViewTask } from '@mytype/typeTask'
import { formatDateString } from '@utils/date-funcs'
import './style.scss'

import ProgressCircle from '@comps/ProgressCircle/ProgressCircle'
import Button from '@comps/Button/Button'
import BlockSubTask from './BlockSubTask'
import Modal from '@comps/Modal/Modal'
import EditorTask from '@comps/EditorTask/EditorTask'

import IcoStart from '@asset/start.svg'
import IcoRisk from '@asset/risk.svg'
import IcoImpact from '@asset/impact.svg'
import IcoSubTasks from '@asset/subtask.svg'
import IcoFilters from '@asset/filter.svg'
import IcoCalendar from '@asset/calendar.svg'

import riskImpact from '@comps/NewTask/BlockCriticalityValues.json'

type TaskProps = {
    objTask: TypeViewTask;
}

function Task({objTask} : TaskProps) {

    const [isOpenRist, setIsOpenRisk] = useState(false)
    const [isOpenSubTask, setIsOpenSubTask] = useState(false)
    const [isOpenFiters, setIsOpenFiters] = useState(false)
    const [isOpenDates, setIsOpenDates] = useState(false)
    const [isOpenEditorTask, setIsOpenEditorTask] = useState(false)

    const deadline = objTask.deadline ? new Date(objTask.deadline) : null;
    const deadlaneDiff = deadline ? Math.floor((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24) + 1) : null;
    const deadlineClass = deadlaneDiff != null && 
        deadlaneDiff < 1 ? "day_1" 
        : deadlaneDiff && deadlaneDiff < 3 ? "days_3"
        : deadlaneDiff && deadlaneDiff < 7 ? "week_1"
        : deadlaneDiff && deadlaneDiff < 14 ? "week_2"
        : "in_near_future"

    const created_at = objTask.created_at ? new Date(objTask.created_at) : null;
    const activation = objTask.activation ? new Date(objTask.activation) : null;

    const riskValue = getRiskImpactValue("risk", objTask.risk);
    const impactValue = getRiskImpactValue("impact", objTask.impact);

    function handleToggleExpanders(arg: string) {
        switch (arg) {
            case "risk":
                setIsOpenRisk(!isOpenRist)
                setIsOpenSubTask(false)
                setIsOpenFiters(false)
                setIsOpenDates(false)
                break
            case "subtask":
                setIsOpenRisk(false)
                setIsOpenSubTask(!isOpenSubTask)
                setIsOpenFiters(false)
                setIsOpenDates(false)
                break
            case "filters":
                setIsOpenRisk(false)
                setIsOpenSubTask(false)
                setIsOpenFiters(!isOpenFiters)
                setIsOpenDates(false)
                break
            case "dates":
                setIsOpenRisk(false)
                setIsOpenSubTask(false)
                setIsOpenFiters(false)
                setIsOpenDates(!isOpenDates)
                break
            default:
                console.warn(`Unknown expander type: ${arg}`)
                return
        }
    }

    function countFilters () {
        return (objTask?.filters.theme?.length || 0) +
            (objTask?.filters.stress?.length || 0) +
            (objTask?.filters.action_type?.length || 0) +
            (objTask?.filters.state
                ? Object.values(objTask?.filters.state).reduce((sum, arr) => sum + (arr?.length || 0), 0)
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
        className={`task-list__item`}
        onClick={() => setIsOpenEditorTask(true)}
        >
        <div className="task-list__item__title">{objTask.title}</div>
        <div className="task-list__item__description">{objTask.description}</div>
        <div className="task-list__item__description">{objTask.motivation}</div>
        {
            objTask.deadline &&
                <div className={`task-list__item__deadline ${deadlineClass}`}>
                    <IcoStart />
                    { deadline ? <span>{formatDateString(deadline)}</span> : "" }
                    { deadlaneDiff != null ? <span className='days'>{`(${deadlaneDiff} days)`}</span> : "" }
                </div>
        }

        <div className="task-list__item__onside">

            {
                (objTask.risk && 0 < objTask.risk) ?
                    <ProgressCircle 
                        title={`risk ${objTask.risk}`} 
                        value={objTask.risk} 
                        Icon={IcoRisk}
                        onClick={e => {
                            handleToggleExpanders("risk")
                            e.stopPropagation()
                        }}
                    /> : null
            }

            {
                (objTask.impact && 0 < objTask.impact) ?
                    <ProgressCircle 
                        title={`impact ${objTask.impact}`} 
                        value={objTask.impact} 
                        Icon={IcoImpact}
                        onClick={e => {
                            handleToggleExpanders("risk")
                            e.stopPropagation()
                        }}
                    /> : null
            }

            <Button 
                variant='transparent'
                IconComponent={IcoSubTasks}
                className="task-list__item__onside__button"
                onClick={e => {
                    handleToggleExpanders("subtask")
                    e.stopPropagation()
                }}
                text={(objTask.subtasks ? objTask.subtasks.reduce((prev, cur) => !cur.status ? prev + 1 : prev, 0): 0).toString()}
            />

            <Button 
                variant='transparent'
                IconComponent={IcoFilters}
                className="task-list__item__onside__button"
                onClick={e => {
                    handleToggleExpanders("filters")
                    e.stopPropagation()
                }}
                text={countFilters().toString()}
            />

            <Button 
                variant='transparent'
                IconComponent={IcoCalendar}
                className="task-list__item__onside__button-circle"
                onClick={e => {
                    handleToggleExpanders("dates")
                    e.stopPropagation()
                }}
            />
        </div>

        <div className={`task-list__item__extender${isOpenFiters ? " view" : ""}`}>
            <div className='task-list__item__onside'>
                {
                    objTask.filters &&
                        Object.entries(objTask.filters).map(([key, filter]) => {
                            if (Array.isArray(filter) && filter.length) {
                                return filter.map((f) => (
                                    <Button 
                                        text={f.name} 
                                        className="task-list__item__filter-button" 
                                        onClick={e => {
                                            console.log(`Filter by ${f.name}`)
                                            e.stopPropagation()
                                        }}
                                        variant="transparent"
                                        key={`filter-for-task-item-${f.id}`}
                                    />
                                ))
                            }
                            if (key === "state" && typeof filter === "object" && filter !== null) {
                                return Object.entries(filter).map(([, subArr]) =>
                                    Array.isArray(subArr) && subArr.length ? (
                                        subArr.map((f) => (
                                            <Button 
                                                text={f.name} 
                                                className="task-list__item__filter-button" 
                                                onClick={e => {
                                                    console.log(`Filter by ${f.name}`)
                                                    e.stopPropagation()
                                                }}
                                                variant="transparent"
                                                key={`filter-for-task-item-${f.id}`}
                                            />
                                        ))
                                    ) : null
                                );
                            }
                            return null;
                        })
                }
            </div>
        </div>

        <div className={`task-list__item__extender${isOpenSubTask ? " view" : ""}`}>
            <div>
                {
                    objTask.subtasks?.map((subtask, index) => (
                        <BlockSubTask 
                            key={`task-subtask-id${index}`} 
                            subtask={subtask}
                        />
                    ))
                }
            </div>
        </div>

        <div className={`task-list__item__extender${isOpenRist ? " view" : ""}`}>
            <div className='task-list__item__risk'>
                {
                    riskValue ? 
                        <div>
                            {/* <span>Risk {riskValue.label}. </span> */}
                            <span>{riskValue.description}</span>
                        </div>
                    : null
                }
                {
                    impactValue ? 
                        <div>
                            {/* <span>Risk {impactValue.label}. </span> */}
                            <span>{impactValue.description}</span>
                        </div>
                    : null
                }
                <div>{objTask.risk_explanation}</div>
                <div>{objTask.risk_proposals}</div>
            </div>
        </div>

        <div className={`task-list__item__extender${isOpenDates ? " view" : ""}`}>
            <div className='task-list__item__dates'>
                <div>
                    <span>Created at: </span>
                    {created_at ? formatDateString(created_at) : "N/A"}
                </div>
                <div>
                    <span>Activated at: </span>
                    {activation ? formatDateString(activation) : "N/A"}
                </div>
                <div>
                    <span>Deadline: </span>
                    {deadline ? formatDateString(deadline) : "N/A"}
                </div>
                <div>
                    <span>Task checks: </span>
                    {
                        objTask.taskchecks.length === 0 ? "N/A" :
                        objTask.taskchecks.map((check, index) => (
                            <div key={`task-check-${index}`}>
                                {formatDateString(new Date(check))}
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    </div>

    {
        // отображение модального окна для задачи
        isOpenEditorTask ? 
            <Modal
                title={`[${objTask.id}] ${objTask.title}`}
                onClose={() => setIsOpenEditorTask(false)}
            >
                <EditorTask originakTask={objTask} />

            </Modal> : null
    }
    </>)
}

export default Task