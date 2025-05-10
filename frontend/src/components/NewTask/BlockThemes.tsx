import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { currentNewTask } from '@utils/jotai.store'
import ThemeElement from '@comps/NewTask/ElementTheme'
import IcoPoint from '@asset/point.svg'
import IcoEdit from '@asset/edit.svg'
import '@comps/Accordion/Accordion.scss'

function BlockThemes() {
    const fillingNewTask = useAtomValue(currentNewTask)
    const [isExpanded, setIsExpanded] = useState(false)

    if (!fillingNewTask.match_themes?.length || !fillingNewTask.new_themes?.length) {
        return null
    }

    return (
        <div className={`accordion${isExpanded ? " view" : ""}`}>
            <div 
                className='new-task__h4 accordion__title' 
                onClick={() => setIsExpanded(!isExpanded)}
                >
                <div className="accordion__pointer"><IcoPoint /></div>
                <span>Темы</span>
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
                        fillingNewTask.match_themes?.length && 
                            fillingNewTask.match_themes?.map((elem, index) => 
                                <ThemeElement {...elem} key={`task-new--theme-${index}`} /> 
                            )
                    }
                    {
                        fillingNewTask.new_themes?.length && 
                            <>
                                <div className='new-task__theme-elem-add-new'>новые темы</div>
                                {
                                    fillingNewTask.new_themes?.map((elem, index) => 
                                        <ThemeElement {...elem} key={`task-new--new-theme-${index}`} /> 
                                    )
                                }
                            </>
                            
                    }
                </div>
            </div>
        </div>
    )
}

export default BlockThemes