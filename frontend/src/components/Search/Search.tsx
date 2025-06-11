import { useState, useRef, useLayoutEffect, useEffect } from 'react'

import { loadTasks } from './loadTasks'

import { useAtom, useAtomValue, searchRequest, openSidePanel, getSearchRequest, deepEqual, samplingStatus } from '@utils/jotai.store'

import Button from '@comps/Button/Button'
import BlockFilter from './BlockFilter'
import BlockPeriod from './BlockPeriod'

import IcoSearch from '@asset/search.svg'
import IcoPreset from '@asset/preset.svg'
import IcoFilter from '@asset/filter.svg'
import IcoAdd from '@asset/add.svg'
import Loader from '@comps/Loader/Loader'

import IcoTheme from '@asset/theme-element.svg'
import IcoState from '@asset/state-element.svg'
import IcoStress from '@asset/stress-element.svg'
import IcoAction from '@asset/event-element.svg'

import IcoImpact from '@asset/impact.svg'
import IcoRisk from '@asset/risk.svg'

import './styles.scss'

function Search() {

    const [switchPanel, setSwitchPanel] = useState<"search"|"preset">("preset");
    const status = useAtomValue(samplingStatus)
    // useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [fillingRequest, updateRequest] = useAtom(searchRequest)
    const [, setPanel] = useAtom(openSidePanel)
    const [isProcessPreset, setProcessPreset] = useState<boolean>(false);

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

    useEffect(() => {
        // инициализация начального пресета
        setProcessPreset(true);
        updateRequest(getSearchRequest("today"));
    }, [])

    useEffect(() => {
        // процес отправки запроса инициализированный установкой пресета
        if (isProcessPreset) {
            loadTasks(true)
            setProcessPreset(false)
        }
    }, [fillingRequest])

    function deleteFilter (index:number) {
        updateRequest({
            ...fillingRequest,
            filters: fillingRequest.filters.filter((_, i) => (i != index))
        })
    }

    return (
        <div className="panel">
            <div className="panel__newtask">
                <Button 
                    IconComponent={IcoAdd} 
                    onClick={() => setPanel("left")}
                />
            </div>
            <div className="panel__search-conteiner">
                <div className={`panel__search${switchPanel === "search" ? " view" : ""}`}>

                    <div 
                        className='search-component'
                        onClick={() => inputRef.current?.focus()}
                        >
                        <div className="search-component__viewer">
                            {/* отображение фильтра «даты активации» */}

                        <BlockPeriod 
                            start={fillingRequest.activation[0]} 
                            finish={fillingRequest.activation[1]}
                            onDelete={() => updateRequest({
                                ...fillingRequest,
                                activation: [null, null]
                            })}
                            tfilter='activation'
                        />

                        {/* отображение фильтра «даты дедлайнов» */}

                        <BlockPeriod 
                            start={fillingRequest.deadline[0]} 
                            finish={fillingRequest.deadline[1]}
                            onDelete={() => updateRequest({
                                ...fillingRequest,
                                deadline: [null, null]
                            })}
                            tfilter='deadline'
                        />

                        {/* отображение фильтра «даты проверки» */}

                        <BlockPeriod 
                            start={fillingRequest.taskchecks[0]} 
                            finish={fillingRequest.taskchecks[1]}
                            onDelete={() => updateRequest({
                                ...fillingRequest,
                                taskchecks: [null, null]
                            })}
                            tfilter='taskchecks'
                        />

                        {/* отображение фильтра «риски» */}
                        
                        {
                            0 < fillingRequest.risk?.length &&
                                <BlockFilter 
                                    text={riskImpactString(fillingRequest.risk, true)}
                                    Icon={IcoRisk}
                                    title="risk"
                                    onDelete={() => {
                                        updateRequest({...fillingRequest, risk: []})
                                    }}
                                />
                        }

                        {/* отображение фильтра «риски невыполнения» */}
                        {
                            0 < fillingRequest.impact?.length &&
                                <BlockFilter 
                                    text={riskImpactString(fillingRequest.impact, false)}
                                    Icon={IcoImpact}
                                    title="impact"
                                    onDelete={() => {
                                        updateRequest({...fillingRequest, impact: []})
                                    }}
                                />
                        }
                        
                        {/* отображение фильтров-ассоциаций */}

                        {
                            fillingRequest.filters.map((elem, index) => (
                                <BlockFilter 
                                    text={elem.value}
                                    key={`spf-f${elem.id}`}
                                    Icon={
                                        elem.type === "theme" ?
                                            IcoTheme
                                        : elem.type === "state" ?
                                            IcoState
                                        : elem.type === "action_type" ?
                                            IcoAction
                                        : IcoStress
                                    }
                                    title={elem.type_title}
                                    onDelete={() => deleteFilter(index)}
                                />
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

                            {/* отображение ввода */}

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
                            className='search-component__filter-btn'
                            IconComponent={IcoFilter}
                            variant='second'
                            onClick={() => setPanel("right")}
                        />
            
                        <Button
                            className='search-component__submit'
                            IconComponent={status === "loading" ? Loader : IcoSearch}
                            onClick={() => loadTasks(true)}
                            disabled={status === 'loading'}
                        />
                    </div>
                </div>
                <div className={`panel__preset${switchPanel === "preset" ? " view" : ""}`}>
                    <div className='preset-component'>
                        <Button
                            text="all"
                            variant={
                                deepEqual("default", fillingRequest) ? "first" : "transparent"
                            }
                            onClick={() => {
                                setProcessPreset(true)
                                updateRequest(getSearchRequest("default"))
                            }}
                        />
                        <Button
                            text="today"
                            variant={
                                deepEqual("today", fillingRequest) ? "first" : "transparent"
                            }
                            onClick={() => {
                                setProcessPreset(true)
                                updateRequest(getSearchRequest("today"))
                            }}
                        />
                        <Button
                            text="3 days"
                            variant={
                                deepEqual("3day", fillingRequest) ? "first" : "transparent"
                            }
                            onClick={() => {
                                setProcessPreset(true)
                                updateRequest(getSearchRequest("3day"))
                            }}
                        />
                        <Button
                            text="1 week"
                            variant={
                                deepEqual("7day", fillingRequest) ? "first" : "transparent"
                            }
                            onClick={() => {
                                setProcessPreset(true)
                                updateRequest(getSearchRequest("7day"))
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="panel__search-switcher">
                <Button 
                    IconComponent={IcoSearch} 
                    className="panel__search-switcher__top" 
                    onClick={() => setSwitchPanel("search")}
                    variant={switchPanel === "search" ? "first" : "second"} 
                />
                <Button 
                    IconComponent={IcoPreset} 
                    className="panel__search-switcher__bottom" 
                    onClick={() => setSwitchPanel("preset")}
                    variant={switchPanel === "preset" ? "first" : "second"} 
                />
            </div>
            
        </div>
    );
}
export default Search;


function riskImpactString (list_ri:number[], isRisk:boolean) : string {
    let result:string[] = []

    list_ri.sort().forEach(n => {
        switch (n) {
            case 0:
                result.push("No"); break;
            case 1:
                result.push("Minor"); break;
            case 2:
                result.push("Moderate"); break;
            case 3:
                isRisk ? result.push("High")
                : result.push("Critical")
                break;
            default:
                break;
        }
    })
    return result.join(", ")
}
