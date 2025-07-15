import { TypeQuery, ruleDoneFailList } from '@mytype/typeSaveQueries'
import { TypeTasks_RI } from '@mytype/typeTask'

import ci_values from '@api/BlockCriticalityValues.json'
import { atomThemeList, useAtomValue } from '@utils/jotai.store'

import TextArea from '@comps/TextArea/TextArea'
import ButtonCalendar from '@comps/ButtonCalendar/ButtonCalendar'
import Toggle from '@comps/Toggles/Toggle'
import CheckBox from '@comps/CheckBox/CheckBox'
import SortControl from '@comps/SortControl/SortControl'
import Button from '@comps/Button/Button'

import IcoList from '@asset/list.svg'
import IconClose from '@asset/close.svg'

import { useState } from 'react'

type TypeProps = {
    title: string
    editable: TypeQuery
    updateEditable: (query: TypeQuery) => void
}

function BlockEditor({title, editable, updateEditable}:TypeProps) {

    const themeList = useAtomValue(atomThemeList)
    const themeListCurrent = themeList
        .filter(f => editable.infilt.includes(f.id))
        .sort((a, b) => editable.infilt.indexOf(a.id) - editable.infilt.indexOf(b.id))

    const [filterCarusels, setStatusCarusels] = useState({
        isTheme: false,
        isThemeNO: false,
        isStress: false,
        isStressNO: false,
        isState: false,
        isStateNO: false,
        isAction: false,
        isActionNO: false,
    })

    return <div className='query-block-editor__block'>
        <div className='query-block-editor__title'>{title}</div>

        <TextArea 
            value={editable.name}
            placeholder="Task title"
            className='query-block-editor__name'
            onChange={e => updateEditable({...editable, name: e.target.value})}
            isBanOnEnter={true}
        />

        <TextArea
            value={editable.descr}
            placeholder="Description"
            className='query-block-editor__descr'
            onChange={e => updateEditable({...editable, descr: e.target.value})}
        />

        <div className='query-block-editor__title'>Поиск по заголовкам и описанию</div>

        <TextArea 
            value={editable.q}
            placeholder="Search text"
            className='query-block-editor__search'
            onChange={e => updateEditable({...editable, q: e.target.value})}
        />

        <div className='query-block-editor__title'>Поиск по вхождению даты создания в период</div>

        <div className='query-block-editor__period'>
            <ButtonCalendar 
                date={""}
                onClickDay={value => {}}
                noDate='ignore'
            />
            <span>-</span>
            <ButtonCalendar 
                date={""}
                onClickDay={value => {}}
                noDate='ignore'
            />
        </div>

        <div className='query-block-editor__title'>Поиск по вхождению даты активации в период</div>

        <div className='query-block-editor__period'>
            <ButtonCalendar 
                date={""}
                onClickDay={value => {}}
                noDate='ignore'
            />
            <span>-</span>
            <ButtonCalendar 
                date={""}
                onClickDay={value => {}}
                noDate='ignore'
            />
        </div>

        <div className='query-block-editor__title'>Поиск по вхождению дат проверок в период</div>

        <div className='query-block-editor__period'>
            <ButtonCalendar 
                date={""}
                onClickDay={value => {}}
                noDate='ignore'
            />
            <span>-</span>
            <ButtonCalendar 
                date={""}
                onClickDay={value => {}}
                noDate='ignore'
            />
        </div>

        <div className='query-block-editor__title'>Поиск по вхождению даты дедлайна в период</div>

        <div className='query-block-editor__period'>
            <ButtonCalendar 
                date={""}
                onClickDay={value => {}}
                noDate='ignore'
            />
            <span>-</span>
            <ButtonCalendar 
                date={""}
                onClickDay={value => {}}
                noDate='ignore'
            />
        </div>

        <div className='query-block-editor__title'>Как поступать с выполненными задачами?</div>

        <Toggle
            elements={[
                {label: "показывать", value: 0},
                {label: "скрывать", value: 1},
                {label: "в начало", value: 2},
                {label: "в конец", value: 3},
            ]}
            activeValue={ruleDoneFailList.indexOf(editable.donerule) === -1 ? 0 : ruleDoneFailList.indexOf(editable.donerule)}
            onChange={v => updateEditable({...editable, donerule: ruleDoneFailList[v]})}
        />

        <div className='query-block-editor__title'>Как поступать с проваленными задачами?</div>
        <Toggle
            elements={[
                {label: "показывать", value: 0},
                {label: "скрывать", value: 1},
                {label: "в начало", value: 2},
                {label: "в конец", value: 3},
            ]}
            activeValue={ruleDoneFailList.indexOf(editable.failrule) === -1 ? 0 : ruleDoneFailList.indexOf(editable.failrule)}
            onChange={v => updateEditable({...editable, failrule: ruleDoneFailList[v]})}
        />

        <div className='query-block-editor__title'>Поиск по темам</div>
        
        <div className='query-block-editor__current-filters'>
            <div className="query-block-editor__current-filters__list">
                {0 < themeListCurrent.length ? themeListCurrent.map(elem => (
                    <div className='query-block-editor__current-filters__item'>
                        <div>{elem.name}</div>
                        <button
                            onClick={() => {
                                updateEditable({
                                    ...editable, infilt: editable.infilt.filter(id => id != elem.id)
                                })
                            }}
                            ><IconClose/></button>
                    </div>
                )) : "-"}
            </div>
            <Button
                variant='second'
                icon={IcoList}
                className={'query-block-editor__current-filters__btn'}
                onClick={() => setStatusCarusels({...filterCarusels, isTheme: ! filterCarusels.isTheme})}
            />
        </div>

        <div className={`query-block-editor__all-filters${filterCarusels.isTheme ? " view" : ""}`}>
            <div>
                {themeList.map((elem, index) => 
                    <div 
                        className={`query-block-editor__all-filters__item${editable.infilt.includes(elem.id) ? " active" : ""}`}
                        onClick={() => {
                            updateEditable({
                                ...editable, 
                                infilt: editable.infilt.includes(elem.id) ?
                                    editable.infilt.filter(id => id != elem.id)
                                    :
                                    [...editable.infilt, elem.id]
                            })
                        }}
                        >
                        <div className='query-block-editor__all-filters__item__name'>{elem.name}</div>
                        <div className='query-block-editor__all-filters__item__descr'>{elem.desc}</div>
                    </div>
                )}
            </div>
        </div>

        <div className='query-block-editor__title'>Исключать из поиска результаты с темами</div>

        <div className='query-block-editor__title'>Поиск по рискам невыполнения</div>
        <div className="query-block-editor__ri">
            {ci_values.risk.map((elem, index) => (
                <CheckBox
                    title={elem.label}
                    state={editable.inrisk.includes(elem.value as TypeTasks_RI)}
                    key={`query_editor > query > block_editor > inrisk-${index}`}
                    onChangeStatus={(newstatus) => {
                        if (newstatus) {
                            updateEditable({
                                ...editable, 
                                inrisk: [...editable.inrisk, elem.value as TypeTasks_RI],
                                exrisk: editable.exrisk.filter(v => v !== elem.value as TypeTasks_RI)
                            })
                        } else {
                            updateEditable({
                                ...editable, 
                                inrisk: editable.inrisk.filter(v => v !== elem.value as TypeTasks_RI)
                            })
                        }
                    }}
                />
            ))}
        </div>
        
        <div className='query-block-editor__title'>Исключать из поиска рисками невыполнения</div>
        <div className="query-block-editor__ri">
            {ci_values.risk.map((elem, index) => (
                <CheckBox
                    title={elem.label}
                    state={editable.exrisk.includes(elem.value as TypeTasks_RI)}
                    key={`query_editor > query > block_editor > inrisk-${index}`}
                    onChangeStatus={(newstatus) => {
                        if (newstatus) {
                            updateEditable({
                                ...editable, 
                                inrisk: editable.inrisk.filter(v => v !== elem.value as TypeTasks_RI),
                                exrisk: [...editable.exrisk, elem.value as TypeTasks_RI]
                            })
                        } else {
                            updateEditable({
                                ...editable, 
                                exrisk: editable.exrisk.filter(v => v !== elem.value as TypeTasks_RI)
                            })
                        }
                    }}
                />
            ))}
        </div>

        <div className='query-block-editor__title'>Поиск по последствиям невыполнения</div>
        <div className="query-block-editor__ri">
            {ci_values.impact.map((elem, index) => (
                <CheckBox
                    title={elem.label}
                    state={editable.inimpact.includes(elem.value as TypeTasks_RI)}
                    key={`query_editor > query > block_editor > inimpact-${index}`}
                    onChangeStatus={(newstatus) => {
                        if (newstatus) {
                            updateEditable({
                                ...editable,
                                inimpact: [...editable.inimpact, elem.value as TypeTasks_RI],
                                eximpact: editable.eximpact.filter(v => v !== elem.value as TypeTasks_RI)
                            })
                        } else {
                            updateEditable({
                                ...editable, 
                                inimpact: editable.inimpact.filter(v => v !== elem.value as TypeTasks_RI)
                            })
                        }
                    }}
                />
            ))}
        </div>

        <div className='query-block-editor__title'>Исключать из поиска последствия невыполнения</div>
        <div className="query-block-editor__ri">
            {ci_values.impact.map((elem, index) => (
                <CheckBox
                    title={elem.label}
                    state={editable.eximpact.includes(elem.value as TypeTasks_RI)}
                    key={`query_editor > query > block_editor > inrisk-${index}`}
                    onChangeStatus={(newstatus) => {
                        if (newstatus) {
                            updateEditable({
                                ...editable, 
                                inimpact: editable.inimpact.filter(v => v !== elem.value as TypeTasks_RI),
                                eximpact: [...editable.eximpact, elem.value as TypeTasks_RI]
                            })
                        } else {
                            updateEditable({
                                ...editable, 
                                eximpact: editable.eximpact.filter(v => v !== elem.value as TypeTasks_RI)
                            })
                        }
                    }}
                />
            ))}
        </div>

        <div className='query-block-editor__title'>Задать сортировку полученных результатов</div>
        <div className="query-block-editor__sort-control">
            <SortControl 
                list={editable.sort}
                onChange={(newSort) => updateEditable({...editable, sort: newSort})}
            />
        </div>


    </div>
}

export default BlockEditor