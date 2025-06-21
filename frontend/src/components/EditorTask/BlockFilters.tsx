
import { TypeFilterServer } from '@mytype/typeSearchAndFilter'
import { TypeTasks_Filter, TypeStates } from '@mytype/typeTask'

import Button from '@comps/Button/Button'
import TextArea from '@comps/TextArea/TextArea'

import IcoRemove from '@asset/close.svg'

export type TypeFilterServer__Tabs = {
    tabname: string
    sysname: TypeStates | undefined
    descr: string
    allList: TypeFilterServer[] | null | undefined
}

type TypeProps = {
    allList?: TypeFilterServer[] | null | undefined // чистый список с фильтрами
    tabList?: TypeFilterServer__Tabs[] // фильтры переданные в вкладках
    curList: TypeTasks_Filter[]
    onAddElement: (elem:TypeTasks_Filter, sub:TypeStates|undefined) => void
    onDelElement: (id:number) => void
    onUpdateElement: (elem:TypeTasks_Filter) => void
    tt: string
    description: string
}

function BlockFilters ({allList, curList, tabList=[], onAddElement, onDelElement, onUpdateElement, tt, description} : TypeProps) {

    const curListID = curList.map(elem => elem.id)

    const toogleFilter = (elem:TypeFilterServer, sub:TypeStates|undefined=undefined) => {
        if (curListID.includes(elem.id)) {
            onDelElement(elem.id)
        } else {
            onAddElement({
                id: elem.id,
                name: elem.name,
                description: elem.description, 
                reason: "",
                proposals: null
            } as TypeTasks_Filter, sub)
        }
    }

    return <div className="editor-task__block-filters">
        {/* <div>{description}</div> */}
        <div className="editor-task__block-filters__col1">
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
        </div>

        <div className="editor-task__block-filters__col2">
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

            {
                tabList?.map((tab, tabIndex) => (<>
                    <div className='editor-task__block-filters__title'>
                        <span>{tab.tabname}</span>
                    </div>
                    {
                        tab.allList?.map((filter, index) => (
                            <button 
                                className={`editor-current-filter-btn${ curListID.includes(filter.id) ? " active" : ""}`}
                                key={`editor-task-id:${filter.id}:${index}`}
                                onClick={() => toogleFilter(filter, tab.sysname)}
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
                </>))
            }          
        </div>

        
    </div>
}

export default BlockFilters