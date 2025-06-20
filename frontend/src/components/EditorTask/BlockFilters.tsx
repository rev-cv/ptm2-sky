
import { TypeFilterServer } from '@mytype/typeSearchAndFilter'
import { TypeTasks_Filter } from '@mytype/typeTask'

import Button from '@comps/Button/Button'
import TextArea from '@comps/TextArea/TextArea'

import IcoRemove from '@asset/close.svg'

type TypeProps = {
    allList: TypeFilterServer[] | null | undefined
    curList: TypeTasks_Filter[]
    onAddElement: (elem:TypeTasks_Filter) => void
    onDelElement: (id:number) => void
    onUpdateElement: (elem:TypeTasks_Filter) => void
    tt: string
    description: string
}

function BlockFilters ({allList, curList, onAddElement, onDelElement, onUpdateElement, tt, description} : TypeProps) {

    const curListID = curList.map(elem => elem.id)

    const toogleFilter = (elem:TypeFilterServer) => {
        if (curListID.includes(elem.id)) {
            onDelElement(elem.id)
        } else {
            onAddElement({
                id: elem.id,
                name: elem.name,
                description: elem.description, 
                reason: "",
                proposals: null
            } as TypeTasks_Filter)
        }
    }

    return <div className="editor-task__block editor-task__block-filters">
        <div className='editor-task__block-filters__title'>
            <span>Добавленные {tt}</span>
        </div>
        {
            curList.map((filter, index) => (
                <div 
                    className='editor-current-filter'
                    key={`editor-task-id:${filter.id}:${index}`}
                    >

                    <div className='editor-current-filter__title'>
                        {filter.name}
                    </div>

                    <Button
                        IconComponent={IcoRemove}
                        variant='remove'
                        onClick={() => onDelElement(filter.id)}
                        className="editor-current-filter__remove"
                        title='remove'
                    />

                    <div className="editor-current-filter__label">
                        reason
                    </div>

                    <TextArea 
                        value={filter.reason}
                        className='editor-current-filter__textarea'
                        onChange={e => onUpdateElement({
                            ...filter, reason: e.target.value
                        })}
                    />
                </div>
                
            ))
        }

        <div className='editor-task__block-filters__d'></div>

        <div className='editor-task__block-filters__title'>
            <span>Все {tt}</span>
        </div>
        {
            allList?.map((filter, index) => (
                <button 
                    className={`editor-current-filter-btn${ curListID.includes(filter.id) ? " active" : ""}`}
                    key={`editor-task-id:${filter.id}:${index}`}
                    onClick={() => toogleFilter(filter)}
                    >
                        <div className="editor-current-filter-btn__title">
                            {filter.name}
                        </div>
                        <div className="editor-current-filter-btn__descr">
                            {filter.description}
                        </div>
                </button>
            ))
        }
    </div>
}

export default BlockFilters