import { TypeQuery } from '@mytype/typeSaveQueries'
import { TypeTasks_RI } from '@mytype/typeTask'

import TextArea from '@comps/TextArea/TextArea'
import ButtonCalendar from '@comps/ButtonCalendar/ButtonCalendar'
import Toggle from '@comps/Toggles/Toggle'
import CheckBox from '@comps/CheckBox/CheckBox'
import SortControl from '@comps/SortControl/SortControl'

import ci_values from '@api/BlockCriticalityValues.json'

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
                {label: "в начало", value: 1},
                {label: "в конец", value: 1},
            ]}
            activeValue={0}
            onChange={v => {}}
        />

        <div className='query-block-editor__title'>Как поступать с проваленными задачами?</div>
        <Toggle
            elements={[
                {label: "показывать", value: 0},
                {label: "скрывать", value: 1},
                {label: "в начало", value: 1},
                {label: "в конец", value: 1},
            ]}
            activeValue={0}
            onChange={v => {}}
        />

        <div className='query-block-editor__title'>Поиск по фильтрам</div>
        <div className='query-block-editor__title'>Исключать из поиска результаты с фильтрами</div>

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