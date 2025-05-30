import { useRef, useEffect, useLayoutEffect } from 'react'
import { useAtom } from 'jotai'
import { openSidePanel, searchRequest } from '@utils/jotai.store'

import Button from '@comps/Button/Button'
import BlockPeriod from './BlockPeriod'

import IcoSearch from '@asset/search.svg'
import IcoFilter from '@asset/filter.svg'
import IcoAdd from '@asset/add.svg'
import IcoClose from '@asset/close.svg'

import IcoTheme from '@asset/theme-element.svg'
import IcoState from '@asset/state-element.svg'
import IcoStress from '@asset/stress-element.svg'
import IcoAction from '@asset/event-element.svg'

import './style.scss'

function SearchForm() {
    const [fillingRequest, updateRequest] = useAtom(searchRequest)
    const [, setPanel] = useAtom(openSidePanel)

    const spanRef = useRef<HTMLSpanElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    function recalcWidth () {
        if (spanRef.current) {
            const spanWidth = spanRef.current.offsetWidth + 20;
            spanRef.current.parentElement?.style.setProperty('--text-width', `${spanWidth}px`);
        }
    }

    useLayoutEffect(() => {recalcWidth()}, [fillingRequest.text])

    useEffect(() => {
        window.addEventListener('resize', recalcWidth)
        return () => window.removeEventListener('resize', recalcWidth)
    }, [])

    function deleteFilter (index:number) {
        updateRequest({
            ...fillingRequest,
            filters: fillingRequest.filters.filter((_, i) => (i != index))
        })
    }

    return <div className='panel'>
        <Button 
            IconComponent={IcoAdd} 
            className="panel__add-new-task" 
            onClick={() => setPanel("left")}
        />
        <div className='search-panel'>
            <div 
                className='search-panel__viewer'
                onClick={() => inputRef.current?.focus()}
                >

                <BlockPeriod 
                    start={fillingRequest.activation[0]} 
                    finish={fillingRequest.activation[1]}
                    onDelete={() => updateRequest({
                        ...fillingRequest,
                        activation: [null, null]
                    })}
                    tfilter='activation'
                />

                <BlockPeriod 
                    start={fillingRequest.deadline[0]} 
                    finish={fillingRequest.deadline[1]}
                    onDelete={() => updateRequest({
                        ...fillingRequest,
                        deadline: [null, null]
                    })}
                    tfilter='deadline'
                />

                <BlockPeriod 
                    start={fillingRequest.taskchecks[0]} 
                    finish={fillingRequest.taskchecks[1]}
                    onDelete={() => updateRequest({
                        ...fillingRequest,
                        taskchecks: [null, null]
                    })}
                    tfilter='taskchecks'
                />
                
                {
                    fillingRequest.filters.map((elem, index) => (
                        <div 
                            className='search-panel__filter' 
                            onClick={e => e.stopPropagation()}
                            key={`spf-f${elem.id}`}
                            title={elem.type_title}
                            >
                            <div>{
                                elem.type === "theme" ?
                                    <IcoTheme />
                                : elem.type === "state" ?
                                    <IcoState />
                                : elem.type === "action_type" ?
                                    <IcoAction />
                                : <IcoStress />
                            }</div>
                            <div>{elem.value}</div>
                            <Button 
                                IconComponent={IcoClose} 
                                onClick={(e) => {
                                    deleteFilter(index)
                                    e.stopPropagation()
                                }}
                            />
                        </div>
                    ))
                }

                <input
                    type="text"
                    ref={inputRef}
                    className="search-panel__input"
                    value={fillingRequest.text}
                    onChange={e => updateRequest({
                        ...fillingRequest, 
                        text: e.target.value
                    })}
                    onKeyDown={e => {
                        if (e.key != "Backspace") return
                        if (fillingRequest.filters.length <= 0) return
                        if (0 < fillingRequest.text.length) return
                        deleteFilter(fillingRequest.filters.length - 1)
                    }}
                />

                <span
                    ref={spanRef}
                    style={{
                        position: 'absolute',
                        visibility: 'hidden',
                        whiteSpace: 'pre',
                        font: 'inherit',
                        padding: 0,
                        margin: 0,
                        top: 0,
                        left: 0
                    }}
                    >{fillingRequest.text || ' '}
                </span>
            </div>

            <Button
                IconComponent={IcoFilter}
                variant='second'
                onClick={() => setPanel("right")}
            />
            
            <Button
                IconComponent={IcoSearch}
            />
            
        </div>
    </div>
    
    
}

export default SearchForm
