import { useAtom } from 'jotai'
import { searchRequest } from '@utils/jotai.store'

import ButtonCalendar from '@comps/ButtonCalendar/ButtonCalendar'
import Expander from '@comps/Expander/Expander'

function BlockActivation () {

    const [search, updateSearch] = useAtom(searchRequest)

    return <Expander 
        title='Дедлайн'
        className={(search.deadline[0] || search.deadline[1]) ? "activation" : ""}
        >
        <div className='filter-panel__period'>
            <div className='filter-panel__period-start'>
                <ButtonCalendar 
                    defaultDate='without beginning'
                    onClickDay={(val) => updateSearch(
                        { ...search, deadline: [val, search.deadline[1]] }
                    )} 
                />
            </div>
            <span>-</span>
            <div className='filter-panel__period-end'>
                <ButtonCalendar 
                    defaultDate='without ending'
                    onClickDay={(val) => updateSearch(
                        { ...search, deadline: [search.deadline[0], val] }
                    )} 
                />
            </div>
        </div>
    </Expander>
}

export default BlockActivation