import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { currentNewTask } from '@utils/jotai.store'
import IcoPoint from '@asset/point.svg'
import IcoEnergyElement from '@asset/energy-element.svg'
import IcoEdit from '@asset/edit.svg'
import IcoStart from '@asset/start.svg'
import IcoCheck from '@asset/check.svg'
import IcoCalendar from '@asset/calendar.svg'
import '@comps/Accordion/Accordion.scss'
import { formatDateString } from '@utils/date-funcs'
import ButtonWithContext from '@comps/ButtonWithContext/ButtonWithContext'
import '@comps/Calendar/CalendarReact.scss'

import { Calendar } from 'react-calendar'

function BlockEnergy() {
    const fillingNewTask = useAtomValue(currentNewTask)
    const [isExpanded, setIsExpanded] = useState(false)

    if (!fillingNewTask.energy_level?.length) return null

    return (
        <div className={`accordion${isExpanded ? " view" : ""}`}>
            <div 
                className='new-task__h4 accordion__title' 
                onClick={() => setIsExpanded(!isExpanded)}
                >
                <div className="accordion__pointer"><IcoPoint /></div>
                <span>Тайминг сроков</span>
                <div className="new-task__edit-block">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                        }}  
                        ><IcoEdit />
                    </button>
                </div>
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
                            <ButtonWithContext IcoForButton={IcoStart} >
                                <Calendar onClickDay={(value, event) => 
                                    console.log('Clicked day: ', value)} 
                                />
                            </ButtonWithContext>
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
                        <div className='new-task__deadline-descr'>123</div>
                        <div className='new-task__deadline-motiv'>144</div>
                    </div>

                    <div className="new-task__energy">
                        <div className='new-task__energy-title'>
                            <IcoCheck />
                            Даты проверок задачи
                        </div>
                        <div className='new-task__energy-descr'>123</div>
                        <div className='new-task__energy-motiv'>144</div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default BlockEnergy