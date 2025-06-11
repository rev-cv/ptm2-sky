import { useAtom, searchRequest } from '@utils/jotai.store'
import { TypeDatePeriods } from '@mytype/typeSearchAndFilter'

import ButtonCalendar from '@comps/ButtonCalendar/ButtonCalendar'
import Expander from '@comps/Expander/Expander'

type TypeBlockFilterDates = {
    period_type: "activation" | "deadline" | "taskchecks"
    title: string
}

function BlockActivation ({title, period_type}:TypeBlockFilterDates) {

    const [search, updateSearch] = useAtom(searchRequest)
    const [s, f] = search[period_type] || [null, null]

    const update = (s:string|null, f:string|null) => {
        let period:TypeDatePeriods = [s, f]
        if (s && f) {
            const [start, finish] = [new Date(s), new Date(f)]
            if (finish < start) {
                period = [f, s]
            }
        }
        
        switch (period_type) {
            case "activation":
                updateSearch({...search, activation: period}); break;
            case "deadline":
                updateSearch({...search, deadline: period}); break;
            case "taskchecks":
                updateSearch({...search, taskchecks: period}); break;
            default:
                break;
        }
    }

    return <Expander 
        title={title} 
        className={(s || f) ? "activation" : ""}
        >
        <div className='filter-panel__period'>
            <div className='filter-panel__period-start'>
                <ButtonCalendar 
                    noDate='without beginning'
                    date={s}
                    onClickDay={(val) => update(val, (search[period_type] || [null, null])[1])}
                />
            </div>
            <span>-</span>
            <div className='filter-panel__period-end'>
                <ButtonCalendar 
                    noDate='without ending'
                    date={f}
                    onClickDay={(val) => update((search[period_type] || [null, null])[0], val)} 
                />
            </div>
        </div>
    </Expander>
}

export default BlockActivation