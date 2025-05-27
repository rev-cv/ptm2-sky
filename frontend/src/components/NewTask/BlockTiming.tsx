import { useState } from 'react'
import { useAtom } from 'jotai'
import { currentNewTask } from '@utils/jotai.store'
import { formatDateString, getDaysDifference, sortDates } from '@utils/date-funcs'

import ButtonCalendar from '@comps/ButtonCalendar/ButtonCalendar'

import IcoPoint from '@asset/point.svg'
import IcoStart from '@asset/start.svg'
import IcoCheck from '@asset/check.svg'
import '@comps/Accordion/Accordion.scss'


function BlockEnergy() {
    const [fillingNewTask, updateNewTask] = useAtom(currentNewTask)
    const [isExpanded, setIsExpanded] = useState(false)

    if (!fillingNewTask.energy_level?.length) return null

    function updateChecksDates(value:string, index: number) {
        let newTaskchecks: string[] = []
        if (!fillingNewTask.taskchecks) return null

        newTaskchecks = [...fillingNewTask.taskchecks]
        newTaskchecks[index] = value

        const dates = sortDates(newTaskchecks)

        updateNewTask({...fillingNewTask, taskchecks: dates})
    }

    return (
        <div className={`accordion${isExpanded ? " view" : ""}`}>
            <div 
                className='new-task__h4 accordion__title' 
                onClick={() => setIsExpanded(!isExpanded)}
                >
                <div className="accordion__pointer"><IcoPoint /></div>
                <span>Тайминг сроков</span>
            </div>
            <div className="accordion__options">
                <div className="accordion__options-sub">
                    
                    <div className="new-task__activate">
                        <div className='new-task__activate-title'>
                            <IcoStart />
                            Дата активации задачи
                        </div>
                        <div className='new-task__activate-time'>
                            {
                                fillingNewTask.activation ? 
                                    formatDateString(fillingNewTask.activation)
                                    : 
                                    "Activation at creation time"
                            }
                            <ButtonCalendar
                                onClickDay={
                                    (value) => updateNewTask({...fillingNewTask, activation: value})
                                }
                            />
                            {
                                fillingNewTask.activation && 
                                    <span className='new-task__activate-time_diff'>
                                        {getDaysDifference(fillingNewTask.activation)} days
                                    </span>
                            }
                        </div>
                        <div className='new-task__deadline-motiv'>
                            Дата, когда задача становится доступной для выполнения.
                        </div>
                    </div>

                    <div className="new-task__deadline">
                        <div className='new-task__deadline-title'>
                            <IcoStart />
                            Дата дедлайна задачи
                        </div>
                        <div className='new-task__deadline-time'>
                            {
                                fillingNewTask.deadline ? 
                                    formatDateString(fillingNewTask.deadline)
                                    : 
                                    "No deadline"
                            }
                            <ButtonCalendar
                                onClickDay={
                                    (value) => updateNewTask({...fillingNewTask, deadline: value})
                                }
                            />
                            {
                                fillingNewTask.deadline && 
                                    <span className='new-task__deadline-time_diff'>
                                        {getDaysDifference(fillingNewTask.deadline)} days
                                    </span>
                            }
                        </div>
                    </div>

                    <div className="new-task__taskchecks">
                        <div className='new-task__taskchecks-title'>
                            <IcoCheck />
                            Даты проверок задачи
                        </div>
                        {
                            fillingNewTask.taskchecks && fillingNewTask.taskchecks.map((datestr, index) => (
                                <div className='new-task__taskchecks-time' key={`data-check-${index}`}>
                                        {
                                            datestr ? formatDateString(datestr) : "Date not set"
                                        }
                                        <ButtonCalendar
                                            onClickDay={value => updateChecksDates(value, index)}
                                        />
                                        {
                                            datestr && 
                                                <span className='new-task__taskchecks-time_diff'>
                                                    {getDaysDifference(datestr)} days
                                                </span>
                                        }
                                </div>
                            ))
                        }
                        <button 
                            onClick={
                                () => updateNewTask({
                                    ...fillingNewTask, 
                                    taskchecks: [
                                        ...(fillingNewTask.taskchecks ? fillingNewTask.taskchecks : []), ""
                                    ]
                                })}
                            >Add check time
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default BlockEnergy