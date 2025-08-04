import { useState } from 'react'
import { TypeFilterNew, TypeFilterNew__Tabs } from '@mytype/typeFilters'
import { TypeTasks_Filter, TypeStates } from '@mytype/typeTask'

import Button from '@comps/Button/Button'
import TextArea from '@comps/TextArea/TextArea'

import IcoRemove from '@asset/close.svg'
import IcoAdd from '@asset/add.svg'
import IcoMagic from '@asset/magic.svg'

type TypeProps = {
    allList?: TypeFilterNew[] | null | undefined // чистый список с фильтрами
    tabList?: TypeFilterNew__Tabs[] // фильтры переданные в вкладках
    curList: TypeTasks_Filter[]
    onAddElement: (elem:TypeTasks_Filter, sub:TypeStates|undefined) => void
    onDelElement: (id:number) => void
    onUpdateElement: (elem:TypeTasks_Filter) => void
    isTheme?: boolean
    tt: string
    description: string
}

function BlockFilters ({allList, curList, tabList=[], onAddElement, onDelElement, onUpdateElement, tt, description, isTheme=false} : TypeProps) {

    const curListID = curList.map(elem => elem.idf)
    let filterCount = 0 
    
    if (tabList) filterCount = tabList.reduce((prev, cur) => cur.allList ? prev + cur.allList.length : prev, 0)
    if (allList) filterCount = allList.length

    const [isOpenAllFilters, setOpenAllFilters] = useState(false)
    
    const toogleFilter = (elem:TypeFilterNew, sub:TypeStates|undefined=undefined) => {
        if (curListID.includes(elem.id)) {
            onDelElement(elem.id)
        } else {
            onAddElement({
                id: -1, // id еще не добавленной ассоциации с фильтром < 0
                idf: elem.id, // id фильтра с котором будет ассоциирована ассоциация
                name: elem.name,
                description: elem.desc, 
                reason: "",
                proposals: null
            } as TypeTasks_Filter, sub)
        }
    }

    return <div className="editor-task__block editor-block-filters">
        <div className='editor-block-filters__about'>{description}</div>

        <div className='editor-block-filters__d'></div>


        <div className="editor-block-filters__added">
            { curList.map((filter, index) => (
                <div 
                    className='editor-block-filters__added-item'
                    key={`editor-task-id:${filter.id}:${index}`}
                    >

                    <div className='editor-block-filters__added-item__title'>
                        {filter.name}
                    </div>

                    <Button
                        icon={IcoRemove}
                        variant='remove'
                        onClick={() => onDelElement(filter.idf)}
                        className="editor-block-filters__added-item__remove"
                        title='remove'
                    />

                    <TextArea 
                        value={filter.reason}
                        label='reason'
                        className='editor-block-filters__added-item__textarea'
                        onChange={e => onUpdateElement({
                            ...filter, reason: e.target.value
                        })}
                    />
                </div>
            ))}

            <div className='editor-block-filters__new-and-gen-btns'>
                <Button icon={IcoMagic}/>
                { !isTheme ? null :
                    <Button icon={IcoAdd} text={'new'}/>
                }
            </div>
        </div>

        <Button 
            text={`все ${tt} - ${filterCount}`} 
            variant='second'
            className='editor-block-filters__all-filters-btn'
            onClick={() => setOpenAllFilters(prev => !prev)}
        />

        <div className={`editor-block-filters__all-filters${isOpenAllFilters ? " view" : ""}`}><div>
            { allList?.map((filter, index) => (
                <button 
                    className={`editor-block-filters__all-filters__item${ curListID.includes(filter.id) ? " active" : ""}`}
                    key={`editor-task-id:${filter.id}:${index}`}
                    onClick={() => toogleFilter(filter)}
                    >
                        <div className="editor-block-filters__all-filters__item__title">
                            {filter.name}
                        </div>
                        <div className="editor-block-filters__all-filters__item__descr">
                            {filter.desc}
                        </div>
                </button>
            ))}

            { tabList?.map(tab => (<>
                <div className='editor-task__block-filters__title'>
                    <span>{tab.tabname}</span>
                </div>
                { tab.allList?.map((filter, index) => (
                    <button 
                        className={`editor-block-filters__all-filters__item${ curListID.includes(filter.id) ? " active" : ""}`}
                        key={`editor-task-id:${filter.id}:${index}`}
                        onClick={() => toogleFilter(filter, tab.sysname)}
                        >
                            <div className="editor-block-filters__all-filters__item__title">
                                {filter.name}
                            </div>
                            <div className="editor-block-filters__all-filters__item__descr">
                                {filter.desc}
                            </div>
                    </button>
                ))}
            </>))}          
        </div></div>

        
    </div>
}

export default BlockFilters