import { useState } from 'react'

import { TypeFilterNew, TypeFilterNew__Tabs } from '@mytype/typeFilters'
import { TypeTasks_Filter, TypeStates } from '@mytype/typeTask'
import { Commands } from '@mytype/typesGen'

import { atomGenTheme, atomGenState, atomGenStress, atomGenAction, useAtom } from '@utils/jotai.store'

import Button from '@comps/Button/Button'
import TextArea from '@comps/TextArea/TextArea'

import IcoRemove from '@asset/close.svg'
import IcoAdd from '@asset/add.svg'
import IcoMagic from '@asset/magic.svg'
import IcoBack from '@asset/back.svg'
import Loader from '@comps/Loader/Loader'

const filterElements = {
    "theme": {
        atomGen: atomGenTheme, 
        title: "темы", 
        command: Commands.GEN_THEME,
        descr: "Категории или области, к которым относится задача, например, работа, учеба или личные проекты."
    },
    "state": {
        atomGen: atomGenState, 
        title: "состояния", 
        command: Commands.GEN_STATE,
        descr: "Условия (эмоциональное настроение, физическая энергия, окружающая обстановка), оптимальные для успешного выполнения задачи."
    },
    "stress": {
        atomGen: atomGenStress, 
        title: "эмоциональные состояния", 
        command: Commands.GEN_STRESS,
        descr: "Эмоции и уровень энергии, которые вызывает процесс выполнения задачи, влияющие на восприятие и мотивацию."
    },
    "action": {
        atomGen: atomGenAction, 
        title: "события", 
        command: Commands.GEN_ACTION,
        descr: "Характер действий, необходимых для выполнения задачи, таких как анализ, творчество или рутинные операции."
    },
}

type TypeProps = {
    type: "theme" | "state" | "stress" | "action"
    curList: TypeTasks_Filter[] // список с добавленными фильтрами
    allList?: TypeFilterNew[] | null | undefined // список со всеми фильтрами
    tabList?: TypeFilterNew__Tabs[] // список со всеми фильтрами разбитыми по группам (для state)
    // передается либо allList, либо tabList
    isTheme?: boolean
    onAddElement: (elem:TypeTasks_Filter, sub:TypeStates|undefined) => void
    onDelElement: (id:number) => void
    onUpdateElement: (elem:TypeTasks_Filter) => void
    onGenerate: (command: typeof Commands[keyof typeof Commands]) => void
    onRollbackGenerate: (oldSteps:TypeTasks_Filter[]) => void
}

function BlockFilters ({type, curList, allList, tabList=[], isTheme=false,
    onAddElement, onDelElement, onUpdateElement, onGenerate, onRollbackGenerate} : TypeProps) {

    const [genFilter, updateGenFilter] = useAtom(filterElements[type].atomGen)
    let newThemes:TypeTasks_Filter[] = []
    if (isTheme) newThemes = curList.filter(elem => elem.idf <= 0 && elem.idf <= 0)

    const hundleGenerate = () => {
        if (genFilter.isGen) {
            // остановка генерации
            updateGenFilter({ isGen: false, fixed: [] })
            onGenerate(Commands.STOP)
            return
        }

        if (0 < genFilter.fixed.length) {
            // откат после генерации
            onRollbackGenerate(genFilter.fixed)
            updateGenFilter({ isGen: false, fixed: [] })
            return
        }

        // старт генерации
        updateGenFilter({ isGen: true, fixed: [...curList] })
        onGenerate(filterElements[type].command)
    }

    const curListID = curList.map(elem => elem.idf)
    let filterCount = 0 
    
    if (tabList) filterCount = tabList.reduce((prev, cur) => cur.allList ? prev + cur.allList.length : prev, 0)
    if (allList) filterCount = allList.length

    const [isOpenAllFilters, setOpenAllFilters] = useState(false)

    const addNewTheme = () => {
        const newAssocID = curList.reduce((prev, cur) => cur.id < 0 ? prev - 1 : prev, -1);
        // ↑ вычисляется оригинальное отрицательное ID для ассоциации 
        // на основе кол-ва уже добавленных новых ассоциаций
        onAddElement({
            id: newAssocID,
            idf: newAssocID,
            name: "",
            description: "",
            reason: ""
        } as TypeTasks_Filter, undefined)
    }
    
    const toogleFilter = (elem:TypeFilterNew, sub:TypeStates|undefined=undefined) => {
        if (curListID.includes(elem.id)) {
            onDelElement(elem.id)
        } else {
            const newAssocID = curList.reduce((prev, cur) => cur.id < 0 ? prev - 1 : prev, -1);
            console.log(newAssocID)
            onAddElement({
                id: newAssocID, // id еще не добавленной ассоциации с фильтром < 0
                idf: elem.id, // id фильтра с котором будет ассоциирована ассоциация
                name: elem.name,
                description: elem.desc, 
                reason: "",
            } as TypeTasks_Filter, sub)
        }
    }

    return <div className="editor-task__block editor-block-filters">
        <div className='editor-block-filters__about'>{filterElements[type].descr}</div>

        <div className='editor-block-filters__d'></div>


        <div className="editor-block-filters__added">
            { curList.map((filter, index) => (
                (0 <= filter.idf) ? <div 
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
                </div> : null
            ))}

            {newThemes.length === 0 ? null : newThemes.map((filter, index) => (
                <div 
                    className='editor-block-filters__added-item'
                    key={`editor-task-id:${filter.id}:${index}`}
                    >

                    <div className='editor-block-filters__added-item__title-new-theme'>
                        Будет добавлена новая тема:
                    </div>

                    <TextArea 
                        value={filter.name}
                        label='name'
                        className='editor-block-filters__added-item__textarea'
                        onChange={e => onUpdateElement({
                            ...filter, name: e.target.value
                        })}
                    />

                    <TextArea 
                        value={filter.description}
                        label='description'
                        className='editor-block-filters__added-item__textarea'
                        onChange={e => onUpdateElement({
                            ...filter, description: e.target.value
                        })}
                    />

                    <TextArea 
                        value={filter.reason}
                        label='reason'
                        className='editor-block-filters__added-item__textarea'
                        onChange={e => onUpdateElement({
                            ...filter, reason: e.target.value
                        })}
                    />

                    <Button
                        icon={IcoRemove}
                        variant='remove'
                        onClick={() => onDelElement(filter.idf)}
                        className="editor-block-filters__added-item__remove"
                        title='remove'
                    />
                </div>
            ))}

            <div className='editor-block-filters__new-and-gen-btns'>
                <Button 
                    icon={
                        (genFilter.isGen) ? Loader : 
                        (0 < genFilter.fixed.length) ? IcoBack : IcoMagic
                    }
                    onClick={hundleGenerate}
                />
                { !isTheme ? null : <Button icon={IcoAdd} text={'new'} onClick={addNewTheme}/> }
            </div>
        </div>

        <Button 
            text={`все ${filterElements[type].title} - ${filterCount}`} 
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