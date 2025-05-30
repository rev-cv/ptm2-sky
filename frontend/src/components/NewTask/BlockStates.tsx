import React from 'react'
import { useAtomValue } from 'jotai'
import { currentNewTask, stateNames } from '@utils/jotai.store'

import { TypeAssociation } from '@mytype/typesNewTask'
import Expander from '@comps/Expander/Expander'
import IcoStateElement from '@asset/state-element.svg'

// function hasNonEmptyArray(obj: object | undefined) {
//     if (!obj) return false
//     return Object.values(obj).some(array => Array.isArray(array) && array.length > 0);
// }

function BlockStates() {
    const fillingNewTask = useAtomValue(currentNewTask)

    // if (!hasNonEmptyArray(fillingNewTask.states)) return null

    return <Expander 
        title='Состояния' 
        onEditData={() => console.log("редактировать «Состояния»")}>
        {
            fillingNewTask.states ? (
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
                                                >{elem.name}
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
            : <div className='new-task__no-data'>no data</div>
        }
    </Expander>
}

export default BlockStates