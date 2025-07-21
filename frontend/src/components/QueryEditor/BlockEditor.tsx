import { TypeQuery, ruleDoneFailList } from '@mytype/typeSaveQueries'
import { TypeTasks_RI } from '@mytype/typeTask'

import ci_values from '@api/BlockCriticalityValues.json'

import { createTask } from '@api/createQuery'

import TextArea from '@comps/TextArea/TextArea'
import ButtonRangeCalendar from '@comps/ButtonCalendar/ButtonRangeCalendar'
import Toggle from '@comps/Toggles/Toggle'
import CheckBox from '@comps/CheckBox/CheckBox'
import SortControl from '@comps/SortControl/SortControl'
import FilterSelector from '@comps/FilterSelector/FilterSelector'
import Button from '@comps/Button/Button'

import IcoDelete from '@asset/delete.svg'
import IcoUpdate from '@asset/save.svg'

type TypeProps = {
    title: string
    editable: TypeQuery
    updateEditable: (query: TypeQuery) => void
}

function BlockEditor({title, editable, updateEditable}:TypeProps) {

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

        <FilterSelector 
            type_filter='theme'

            intitle='Поиск по темам'
            extitle='Исключать задачи с темами'

            infilt={editable.infilt}
            exfilt={editable.exfilt}

            titleClass='query-block-editor__title'

            updateFilters={(infilt, exfilt) => updateEditable(
                {...editable, infilt, exfilt}
            )}
        />

        <FilterSelector 
            type_filter='state'

            intitle='Поиск по текущему состоянию'
            extitle='Исключать задачи не соответствующие текущему состоянию'

            infilt={editable.infilt}
            exfilt={editable.exfilt}

            titleClass='query-block-editor__title'

            updateFilters={(infilt, exfilt) => updateEditable(
                {...editable, infilt, exfilt}
            )}
        />

        <FilterSelector 
            type_filter='action'

            intitle='Поиск по типу деятельности'
            extitle='Исключать задачи с типами действий'

            infilt={editable.infilt}
            exfilt={editable.exfilt}

            titleClass='query-block-editor__title'

            updateFilters={(infilt, exfilt) => updateEditable(
                {...editable, infilt, exfilt}
            )}
        />

        <FilterSelector 
            type_filter='stress'

            intitle='Поиск по эмоциональной нагрузке'
            extitle='Исключать задачи с эмоциональной нагрузкой'

            infilt={editable.infilt}
            exfilt={editable.exfilt}

            titleClass='query-block-editor__title'

            updateFilters={(infilt, exfilt) => updateEditable(
                {...editable, infilt, exfilt}
            )}
        />

        <div className='query-block-editor__title'>Поиск по вхождению даты создания в период</div>

        <div className='query-block-editor__period'>
            <ButtonRangeCalendar 
                date={editable.crange[0]}
                onClickDay={value => updateEditable({...editable, crange: [value, editable.crange[1]]})}
                noDate='ignore'
            />
            <span>-</span>
            <ButtonRangeCalendar 
                date={editable.crange[1]}
                onClickDay={value => updateEditable({...editable, crange: [editable.crange[0], value]})}
                noDate='ignore'
            />
        </div>

        <div className='query-block-editor__title'>Поиск по вхождению даты активации в период</div>

        <div className='query-block-editor__period'>
            <ButtonRangeCalendar 
                date={editable.arange[0]}
                onClickDay={value => updateEditable({...editable, arange: [value, editable.arange[1]]})}
                noDate='ignore'
            />
            <span>-</span>
            <ButtonRangeCalendar 
                date={editable.arange[1]}
                onClickDay={value => updateEditable({...editable, arange: [editable.arange[0], value]})}
                noDate='ignore'
            />
        </div>

        <div className='query-block-editor__title'>Поиск по вхождению дат проверок в период</div>

        <div className='query-block-editor__period'>
            <ButtonRangeCalendar 
                date={editable.irange[0]}
                onClickDay={value => updateEditable({...editable, irange: [value, editable.irange[1]]})}
                noDate='ignore'
            />
            <span>-</span>
            <ButtonRangeCalendar 
                date={editable.irange[1]}
                onClickDay={value => updateEditable({...editable, irange: [editable.irange[0], value]})}
                noDate='ignore'
            />
        </div>

        <div className='query-block-editor__title'>Поиск по вхождению даты дедлайна в период</div>

        <div className='query-block-editor__period'>
            <ButtonRangeCalendar 
                date={editable.drange[0]}
                onClickDay={value => updateEditable({...editable, drange: [value, editable.drange[1]]})}
                noDate='ignore'
            />
            <span>-</span>
            <ButtonRangeCalendar 
                date={editable.drange[1]}
                onClickDay={value => updateEditable({...editable, drange: [editable.drange[0], value]})}
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
        
        <div className='query-block-editor__title'>Исключать из поиска риски невыполнения</div>
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

        <div className='query-block-editor__bottom'>
            {
                editable.id < 0 ?

                <Button 
                    text="create"
                    icon={IcoUpdate}
                    onClick={() => createTask(editable)}
                /> : <>
                    <Button 
                        text="delete"
                        icon={IcoDelete}
                        variant='remove'
                    />
                    <Button 
                        text="update"
                        icon={IcoUpdate}
                    />
                </>
            }
            

            
        </div>

    </div>
}

export default BlockEditor