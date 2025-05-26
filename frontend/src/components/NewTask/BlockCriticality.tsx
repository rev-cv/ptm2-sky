import { useState } from 'react'
import { useAtom } from 'jotai'
import { currentNewTask } from '@utils/jotai.store'
import IcoPoint from '@asset/point.svg'
import IcoImpact from '@asset/impact.svg'
import IcoRisk from '@asset/risk.svg'
import '@comps/Accordion/Accordion.scss'

import Toggle from '@comps/Toggles/Toggle'

import values_component from '@comps/NewTask/BlockCriticalityValues.json'

function BlockEnergy() {
    const [fillingNewTask, updateNewTask] = useAtom(currentNewTask)
    const [isExpanded, setIsExpanded] = useState(false)

    if (!('risk' in fillingNewTask)) return null

    return (
        <div className={`accordion${isExpanded ? " view" : ""}`}>
            <div 
                className='new-task__h4 accordion__title' 
                onClick={() => setIsExpanded(!isExpanded)}
                >
                <div className="accordion__pointer"><IcoPoint /></div>
                <span>Оценка критичности</span>
            </div>
            <div className="accordion__options">
                <div className="accordion__options-sub">
                    <div className="new-task__energy">
                        <div className='new-task__energy-title'>
                            <IcoRisk />
                            Риски невыполнения
                        </div>
                        <Toggle
                            elements={values_component.risk}
                            onChange={(v:number) => {
                                if ([0, 1, 2, 3].includes(v)) {
                                    updateNewTask({...fillingNewTask, risk: v as 0 | 2 | 1 | 3})
                                }
                            }}
                            activeValue={fillingNewTask.risk || 0}
                        />
                        <div className="new-task__energy-descr">
                            { values_component.risk.find(item => item.value === fillingNewTask.risk)?.description }
                        </div>
                        <div className="new-task__energy-motiv">{fillingNewTask.risk_explanation}</div>
                        <div className="new-task__energy-motiv">{fillingNewTask.risk_proposals}</div>
                    </div>

                    <div className="new-task__energy">
                        <div className='new-task__energy-title'>
                            <IcoImpact />
                            Последствия невыполнения
                        </div>
                        <Toggle 
                            elements={values_component.impact}
                            onChange={(v:number) => {
                                if ([0, 1, 2, 3].includes(v)) {
                                    updateNewTask({...fillingNewTask, impact: v as 0 | 2 | 1 | 3})
                                }
                            }}
                            activeValue={fillingNewTask.impact || 0}
                        />
                        <div className="new-task__energy-descr">
                            { values_component.impact.find(item => item.value === fillingNewTask.impact)?.description }
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default BlockEnergy