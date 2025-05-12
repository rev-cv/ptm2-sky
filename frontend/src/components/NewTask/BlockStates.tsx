import React, { useState } from 'react'
import { useAtomValue } from 'jotai'
import { currentNewTask } from '@utils/jotai.store'
import IcoPoint from '@asset/point.svg'
import '@comps/Accordion/Accordion.scss'
import IcoStateElement from '@asset/states-element.svg'
import IcoEdit from '@asset/edit.svg'
import { TypeAssociation } from '@mytype/typesNewTask'

const stateNames = {
    "physical": "физическое",
    "intellectual": "интеллектуальное",
    "emotional": "эмоциональное",
    "motivational": "мотивационное",
    "social": "социальное",
}

function hasNonEmptyArray(obj: object | undefined) {
    if (!obj) return false
    return Object.values(obj).some(array => Array.isArray(array) && array.length > 0);
}

function BlockStates() {
    const fillingNewTask = useAtomValue(currentNewTask)
    const [isExpanded, setIsExpanded] = useState(false)

    if (!hasNonEmptyArray(fillingNewTask.states)) return null

    return (
        <div className={`accordion${isExpanded ? " view" : ""}`}>
            <div 
                className='new-task__h4 accordion__title' 
                onClick={() => setIsExpanded(!isExpanded)}
                >
                <div className="accordion__pointer"><IcoPoint /></div>
                <span>Состояния</span>
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
                        fillingNewTask.states && (
                            <div className="new-task__states">
                                {
                                    Object.entries(fillingNewTask.states).map(([key, array], index) => (
                                        <React.Fragment key={`${key}-${index}`}>
                                            <div className='new-task__states-title'>
                                                <IcoStateElement />
                                                {stateNames[key as keyof typeof stateNames]} состояние
                                            </div>
                                            {
                                                array.map((elem: TypeAssociation, i) => (
                                                    <React.Fragment key={`${key}-${index}-${i}`}>
                                                        <div 
                                                            className='new-task__states-name' 
                                                            >{elem.title}
                                                        </div>
                                                        <div 
                                                            className='new-task__states-motiv'
                                                            >{elem.reason}
                                                        </div>
                                                    </React.Fragment>
                                                ))
                                            }
                                        </React.Fragment>
                                    ))
                                }
                            </div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default BlockStates