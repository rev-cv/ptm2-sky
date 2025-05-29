import { useAtom } from 'jotai'
import { searchRequest } from '@utils/jotai.store'

import ButtonCalendar from '@comps/ButtonCalendar/ButtonCalendar'
import Expander from '@comps/Expander/Expander'

function BlockActivation () {

    const [search, updateSearch] = useAtom(searchRequest)

    return <Expander 
        title='Даты проверок'
        className={(search.taskchecks[0] || search.taskchecks[1]) ? "activation" : ""}
        >
        <div className='filter-panel__period'>
            <div className='filter-panel__period-start'>
                <ButtonCalendar 
                    defaultDate='without beginning'
                    onClickDay={(val) => updateSearch(
                        { ...search, taskchecks: [val, search.taskchecks[1]] }
                    )} 
                />
            </div>
            <span>-</span>
            <div className='filter-panel__period-end'>
                <ButtonCalendar 
                    defaultDate='without ending'
                    onClickDay={(val) => updateSearch(
                        { ...search, taskchecks: [search.taskchecks[0], val] }
                    )} 
                />
            </div>
        </div>
    </Expander>
}

export default BlockActivation