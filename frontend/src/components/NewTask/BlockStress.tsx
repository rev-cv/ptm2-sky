import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { currentNewTask } from '@utils/jotai.store'
import IcoPoint from '@asset/point.svg'
import IcoStressElement from '@asset/stress-element.svg'
import IcoEdit from '@asset/edit.svg'
import '@comps/Accordion/Accordion.scss'

function BlockStress() {
    const fillingNewTask = useAtomValue(currentNewTask)
    const [isExpanded, setIsExpanded] = useState(false)

    if (!fillingNewTask.stress?.length) return null

    return (
        <div className={`accordion${isExpanded ? " view" : ""}`}>
            <div 
                className='new-task__h4 accordion__title' 
                onClick={() => setIsExpanded(!isExpanded)}
                >
                <div className="accordion__pointer"><IcoPoint /></div>
                <span>Эмоциональная нагрузка</span>
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
                        fillingNewTask.stress?.map((elem, index) => (
                            <div className="new-task__theme-elem" key={`task-new--stress-${index}`}>
                                <div className='new-task__theme-elem-title'>
                                    <IcoStressElement />
                                    {elem.name}
                                </div>
                                <div className='new-task__subtask-descr'>{elem.description}</div>
                                <div className='new-task__subtask-motiv'>{elem.reason}</div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default BlockStress