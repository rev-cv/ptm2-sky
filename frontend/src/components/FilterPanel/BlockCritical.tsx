import { useAtom } from 'jotai'
import { searchRequest } from '@utils/jotai.store'

import IcoImpact from '@asset/impact.svg'
import IcoRisk from '@asset/risk.svg'

import Expander from '@comps/Expander/Expander'

import values_component from '@comps/NewTask/BlockCriticalityValues.json'

function BlockCritical () {
    
    const [search, updateSearch] = useAtom(searchRequest)

    return <Expander title='Критичность'>
        <div className="new-task__energy">
            <div className='new-task__energy-title'>
                <IcoRisk />
                Риски невыполнения
            </div>
            {/* <Toggle
                elements={values_component.risk}
                onChange={(v:number) => {
                    if ([0, 1, 2, 3].includes(v)) {
                        updateNewTask({...fillingNewTask, risk: v as 0 | 2 | 1 | 3})
                    }
                }}
                activeValue={fillingNewTask.risk || 0}
            /> */}
            {/* <div className="new-task__energy-descr">
                { values_component.risk.find(item => item.value === fillingNewTask.risk)?.description }
            </div>
            <div className="new-task__energy-motiv">{fillingNewTask.risk_explanation}</div>
            <div className="new-task__energy-motiv">{fillingNewTask.risk_proposals}</div> */}
        </div>

        <div className="new-task__energy">
            <div className='new-task__energy-title'>
                <IcoImpact />
                Последствия невыполнения
            </div>
            {/* <Toggle 
                elements={values_component.impact}
                onChange={(v:number) => {
                    if ([0, 1, 2, 3].includes(v)) {
                        updateNewTask({...fillingNewTask, impact: v as 0 | 2 | 1 | 3})
                    }
                }}
                activeValue={fillingNewTask.impact || 0}
            />
            <div className="new-task__energy-descr">
                { values_component.impact.find(item => item.value === fillingNewTask.impact)?.description }
            </div> */}
        </div>
    </Expander>
}

export default BlockCritical