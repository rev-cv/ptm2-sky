import { useAtom } from 'jotai'
import { searchRequest } from '@utils/jotai.store'

import { useState } from 'react'
import ButtonCalendar from '@comps/ButtonCalendar/ButtonCalendar'
import IcoPoint from '@asset/point.svg'

function BlockActivation () {

    const [search, updateSearch] = useAtom(searchRequest)
    const [isExpanded, setIsExpanded] = useState(false)

    return <div className={`accordion${isExpanded ? " view" : ""}`}>
        <div 
            className='filter-panel__h4 accordion__title' 
            onClick={() => setIsExpanded(!isExpanded)}
            >
            <div className="accordion__pointer"><IcoPoint /></div>
            <span>Активация</span>
        </div>
        <div className="accordion__options">
            <div className="accordion__options-sub">
                <div className='filter-panel__period'>
                    <div className='filter-panel__period-start'>
                        <ButtonCalendar 
                            defaultDate='without beginning'
                            onClickDay={(val) => updateSearch(
                                { ...search, activation: [val, search.activation[1]] }
                            )} 
                        />
                    </div>
                    <span>-</span>
                    <div className='filter-panel__period-end'>
                        <ButtonCalendar 
                            defaultDate='without ending'
                            onClickDay={(val) => updateSearch(
                                { ...search, activation: [search.activation[0], val] }
                            )} 
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default BlockActivation