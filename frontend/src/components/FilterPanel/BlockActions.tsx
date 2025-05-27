import { useState } from 'react'
import IcoPoint from '@asset/point.svg'


function BlockActivation () {

    const [isExpanded, setIsExpanded] = useState(false)

    return <div className={`accordion${isExpanded ? " view" : ""}`}>
        <div 
            className='new-task__h4 accordion__title' 
            onClick={() => setIsExpanded(!isExpanded)}
            >
            <div className="accordion__pointer"><IcoPoint /></div>
            <span>Действия</span>
        </div>
        <div className="accordion__options">
            <div className="accordion__options-sub">
                
                
            </div>
        </div>
    </div>
}

export default BlockActivation