import { useRef, useEffect, useLayoutEffect } from 'react'
import { useAtom } from 'jotai'
import { openSidePanel, searchRequest } from '@utils/jotai.store'

import Button from '@comps/Button/Button'

import IcoSearch from '@asset/search.svg'
import IcoFilter from '@asset/filter.svg'
import IcoAdd from '@asset/add.svg'
import IcoClose from '@asset/close.svg'

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

    function deleteFilter (index:number, event:React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        updateRequest({
            ...fillingRequest,
            filters: fillingRequest.filters.filter((_, i) => (i != index))
        })
        event.stopPropagation()
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
                {
                    fillingRequest.filters.map((elem, index) => (
                        <div 
                            className='search-panel__filter' 
                            onClick={e => e.stopPropagation()
                            }>
                            <div>{elem.value}</div>
                            <Button 
                                IconComponent={IcoClose} 
                                onClick={(e) => deleteFilter(index, e)}
                            />
                        </div>
                    ))
                }
                <input
                    type="text"
                    ref={inputRef}
                    value={fillingRequest.text}
                    onChange={e => updateRequest({
                        ...fillingRequest, 
                        text: e.target.value
                    })}
                    className="search-panel__input"
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
