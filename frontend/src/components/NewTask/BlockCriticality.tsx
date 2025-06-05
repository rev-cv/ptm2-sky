import { useAtom, currentNewTask } from '@utils/jotai.store'

import Expander from '@comps/Expander/Expander'
import Toggle from '@comps/Toggles/Toggle'

import IcoImpact from '@asset/impact.svg'
import IcoRisk from '@asset/risk.svg'

import values_component from '@comps/NewTask/BlockCriticalityValues.json'

function BlockEnergy() {
    const [fillingNewTask, updateNewTask] = useAtom(currentNewTask)

    // if (!('risk' in fillingNewTask)) return null

    return <Expander title='Оценка критичности'>
        <div className="new-task__energy">
            <div className='new-task__energy-title'>
                <IcoRisk />
                Риски невыполнения
            </div>
            <Toggle
                elements={values_component.risk}
                onChange={(v:number) => {
                    if ([0, 1, 2, 3].includes(v)) {
                        updateNewTask({...fillingNewTask, risk: v as 0 | 2 | 1 | 3})
                    }
                }}
                activeValue={fillingNewTask.risk || 0}
            />
            <div className="new-task__energy-descr">
                { values_component.risk.find(item => item.value === fillingNewTask.risk)?.description }
            </div>
            <div className="new-task__energy-motiv">{fillingNewTask.risk_explanation}</div>
            <div className="new-task__energy-motiv">{fillingNewTask.risk_proposals}</div>
        </div>

        <div className="new-task__energy">
            <div className='new-task__energy-title'>
                <IcoImpact />
                Последствия невыполнения
            </div>
            <Toggle 
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
            </div>
        </div>
    </Expander>
}

export default BlockEnergy