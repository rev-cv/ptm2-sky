import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { currentNewTask } from '@utils/jotai.store'
import IcoPoint from '@asset/point.svg'
import IcoEnergyElement from '@asset/energy-element.svg'
import IcoEdit from '@asset/edit.svg'
import '@comps/Accordion/Accordion.scss'

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
                <span>Уровень энергии</span>
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
                    { 
                        fillingNewTask.energy_level?.map((elem, index) => (
                            <div className="new-task__energy" key={`task-new--stress-${index}`}>
                                <div className='new-task__energy-title'>
                                    <IcoEnergyElement />
                                    {elem.name}
                                </div>
                                <div className='new-task__energy-descr'>{elem.description}</div>
                                <div className='new-task__energy-motiv'>{elem.reason}</div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default BlockEnergy