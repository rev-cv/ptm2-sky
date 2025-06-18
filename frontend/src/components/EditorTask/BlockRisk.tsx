import { TypeTasks_RI } from '@mytype/typeTask'

import IcoImpact from '@asset/impact.svg'
import IcoRisk from '@asset/risk.svg'

import Toggle from '@comps/Toggles/Toggle'
import TextArea from '@comps/TextArea/TextArea'

import values_component from '@comps/NewTask/BlockCriticalityValues.json'

type TypeProps = {
    risk: TypeTasks_RI
    impact: TypeTasks_RI
    risk_proposals?: string
    risk_explanation?: string
    onChangeRisk: (r:TypeTasks_RI) => void
    onChangeImpact: (i:TypeTasks_RI) => void
    onChangeProp: (text:string) => void
    onChangeExpl: (text:string) => void
}

function BlockRisk ({risk, impact, risk_proposals="", risk_explanation="",
    onChangeRisk, onChangeImpact, onChangeProp, onChangeExpl }:TypeProps) {

    return <div className='editor-task__block editor-task__block-risk'>

        <div className='editor-task__block-risk__title'>
            <IcoRisk />
            <span>Риски невыполнения</span>
        </div>

        <Toggle
            elements={values_component.risk}
            onChange={(v:number) => onChangeRisk(v as TypeTasks_RI)}
            activeValue={risk}
        />

        <div className="editor-task__block-risk__descr">
            { values_component.risk.find(item => item.value === risk)?.description }
        </div>

        <div className='editor-task__block-risk__label'>proposals</div>
        <TextArea 
            className='editor-task__block-risk__prop'
            value={risk_proposals}
            onChange={e => onChangeProp(e.target.value)}
        />

        <div className='editor-task__block-risk__label'>explanation</div>
        <TextArea 
            className='editor-task__block-risk__prop'
            value={risk_explanation}
            onChange={e => onChangeExpl(e.target.value)}
        />

        <div className='editor-task__block-impact__d'></div>

        <div className='editor-task__block-impact__title'>
            <IcoImpact />
            <span>Риски невыполнения</span>
        </div>

        <Toggle
            elements={values_component.impact}
            onChange={(v:number) => onChangeImpact(v as TypeTasks_RI)}
            activeValue={impact}
        />

        <div className="editor-task__block-impact__descr">
            { values_component.impact.find(item => item.value === impact)?.description }
        </div>
    </div>
}

export default BlockRisk