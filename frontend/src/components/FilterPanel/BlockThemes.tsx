import { useState } from 'react'
import IcoPoint from '@asset/point.svg'

function BlockThemes () {

    const [isExpanded, setIsExpanded] = useState(false)

    return <div className={`accordion${isExpanded ? " view" : ""}`}>
        <div 
            className='new-task__h4 accordion__title' 
            onClick={() => setIsExpanded(!isExpanded)}
            >
            <div className="accordion__pointer"><IcoPoint /></div>
            <span>Темы</span>
        </div>
        <div className="accordion__options">
            <div className="accordion__options-sub">
                123
            </div>
        </div>
    </div>
}

export default BlockThemes