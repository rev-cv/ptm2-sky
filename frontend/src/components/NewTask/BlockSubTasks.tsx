import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { currentNewTask } from '@utils/jotai.store'
import SubTask from '@comps/NewTask/ElementSubTask'
import IcoPoint from '@asset/point.svg'
import IcoEdit from '@asset/edit.svg'
import '@comps/Accordion/Accordion.scss'

function BlockThemes() {
    const fillingNewTask = useAtomValue(currentNewTask)
    const [isExpanded, setIsExpanded] = useState(false)

    if (!fillingNewTask.subtasks?.length) return null

    return (
        <div className={`accordion${isExpanded ? " view" : ""}`}>
            <div 
                className='new-task__h4 accordion__title' 
                onClick={() => setIsExpanded(!isExpanded)}
                >
                <div className="accordion__pointer"><IcoPoint /></div>
                <span>Подзадачи</span>
                <div className="new-task__edit-block">
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                        }}  
                        ><IcoEdit /></button>
                </div>
            </div>
            <div className="accordion__options">
                <div className="accordion__options-sub">
                    { 
                        fillingNewTask.subtasks?.map((elem, index) => 
                            <SubTask {...elem} key={`task-new--subtask-${index}`} />
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default BlockThemes