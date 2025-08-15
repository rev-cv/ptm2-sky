import './style.scss'
import { useState } from 'react'
import { atomThemeList, atomActionList, useAtomValue } from '@utils/jotai.store'
import { TypeFilterNew } from '@mytype/typeFilters'

import Button from '@comps/Button/Button'

import IcoList from '@asset/list.svg'
import IconClose from '@asset/close.svg'
import IcoInlist from '@asset/inlist.svg'
import IcoExlist from '@asset/exlist.svg'

type TypeProps = {
    type_filter: "theme" | "action" | "stress" | "state"

    intitle?: string
    infilt: number[]

    extitle?: string
    exfilt: number[]

    titleClass?: string

    updateFilters: (infilt:number[], exfilt:number[]) => void
}

function FilterSelector ({type_filter, intitle, infilt, extitle, exfilt, updateFilters, titleClass }:TypeProps) {

    const atomList = 
        type_filter === "theme"  ? atomThemeList :
        type_filter === "action" ? atomActionList :
        undefined

    const filterList = atomList ? useAtomValue(atomList) : []

    const selectInList = filterList
        .filter(f => infilt.includes(f.id))
        .sort((a, b) => infilt.indexOf(a.id) - infilt.indexOf(b.id))

    const selectExList = filterList
        .filter(f => exfilt.includes(f.id))
        .sort((a, b) => exfilt.indexOf(a.id) - exfilt.indexOf(b.id))

    const [isOpenInFilter, setStatusInFilters] = useState(false)
    const [isOpenExFilter, setStatusExFilters] = useState(false)

    const toogleActionByFilter = (action:"in"|"ex", filt:TypeFilterNew) => {
        let newInfilte:number[] = []
        let newExfilte:number[] = []

        if (action==="in") {
            if (infilt.includes(filt.id)){
                newInfilte = infilt.filter(id => id != filt.id)
            } else {
                newInfilte = [...infilt, filt.id]
            }
            newExfilte = exfilt.filter(id => id != filt.id)
        } else if (action==="ex") {
            if (exfilt.includes(filt.id)){
                newExfilte = exfilt.filter(id => id != filt.id)
            } else {
                newExfilte = [...exfilt, filt.id]
            }
            newInfilte = infilt.filter(id => id != filt.id)
        }

        updateFilters(newInfilte, newExfilte)
    }
    
    return <>
        {intitle ? <div className={titleClass ? titleClass : ""}>{intitle}</div> : null}

        <div className='filter-selected'>
            <div className="filter-selected__list">
                <IcoInlist />
                {0 < selectInList.length ? selectInList.map((elem, index) => (
                    <div 
                        className='filter-selected__item' 
                        key={`selected filter for infilt > item ID ${elem.id} (${index})`}>
                        <div>{elem.name}</div>
                        <button
                            onClick={() => updateFilters(
                                infilt.filter(id => id != elem.id), [...exfilt]
                            )}
                            ><IconClose/>
                        </button>
                    </div>
                )) : ""}
            </div>
            <Button
                variant='second'
                icon={IcoList}
                className={'filter-selected__btn'}
                onClick={() => setStatusInFilters(!isOpenInFilter)}
            />
        </div>

        <div className={`filter-all-list${isOpenInFilter ? " view" : ""}`}>
            <div>
                {filterList.map((elem, index) => 
                    <div 
                        className={`filter-all-list__item${infilt.includes(elem.id) ? " active" : ""}`}
                        onClick={() => toogleActionByFilter("in", elem)}
                        key={`all filter for infilt > item ID ${elem.id} (${index})`}>
                        <div className='filter-all-list__item__name'>{elem.name}</div>
                        <div className='filter-all-list__item__descr'>{elem.desc}</div>
                    </div>
                )}
            </div>
        </div>
        
        {extitle ? <div className={titleClass ? titleClass : ""}>{extitle}</div> : null}

        <div className='filter-selected'>
            <div className="filter-selected__list">
                <IcoExlist />
                {0 < selectExList.length ? selectExList.map((elem, index) => (
                    <div 
                        className='filter-selected__item' 
                        key={`selected filter for exfilt > item ID ${elem.id} (${index})`}>
                        <div>{elem.name}</div>
                        <button
                            onClick={() => updateFilters(
                                [...infilt], exfilt.filter(id => id != elem.id)
                            )}
                            ><IconClose/>
                        </button>
                    </div>
                )) : ""}
            </div>
            <Button
                variant='second'
                icon={IcoList}
                className={'filter-selected__btn'}
                onClick={() => setStatusExFilters(!isOpenExFilter)}
            />
        </div>

        <div className={`filter-all-list${isOpenExFilter ? " view" : ""}`}>
            <div>
                {filterList.map((elem, index) => 
                    <div 
                        className={`filter-all-list__item${exfilt.includes(elem.id) ? " active" : ""}`}
                        onClick={() => toogleActionByFilter("ex", elem)}
                        key={`all filter for exfilt > item ID ${elem.id} (${index})`}>
                        <div className='filter-all-list__item__name'>{elem.name}</div>
                        <div className='filter-all-list__item__descr'>{elem.desc}</div>
                    </div>
                )}
            </div>
        </div>
    </>
}

export default FilterSelector