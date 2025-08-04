import { TypeTasks_RI } from '@mytype/typeTask'
import values_component from '@api/BlockCriticalityValues.json'

import Toggle from '@comps/Toggles/Toggle'
import TextArea from '@comps/TextArea/TextArea'
import Button from '@comps/Button/Button'

import IcoImpact from '@asset/impact.svg'
import IcoRisk from '@asset/risk.svg'
import IcoMagic from '@asset/magic.svg'


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

    return <div className='editor-task__block editor-block-riskimpact'>

        <div className='editor-block-riskimpact__title'>
            <IcoRisk />
            <span>Риски невыполнения</span>
        </div>

        <Toggle
            elements={values_component.risk}
            onChange={(v:number) => onChangeRisk(v as TypeTasks_RI)}
            activeValue={risk}
        />

        <div className="editor-block-riskimpact__descr">
            { values_component.risk.find(item => item.value === risk)?.description }
        </div>

        <TextArea 
            className='editor-block-riskimpact__prop'
            value={risk_proposals}
            label='proposals'
            onChange={e => onChangeProp(e.target.value)}
        />

        <TextArea 
            className='editor-block-riskimpact__prop'
            label='explanation'
            value={risk_explanation}
            onChange={e => onChangeExpl(e.target.value)}
        />

        <Button 
            icon={IcoMagic}
            className="editor-block-riskimpact__gen-btn"
        />

        <div className='editor-block-riskimpact__d'></div>

        <div className='editor-block-riskimpact__title'>
            <IcoImpact />
            <span>Риски невыполнения</span>
        </div>

        <Toggle
            elements={values_component.impact}
            onChange={(v:number) => onChangeImpact(v as TypeTasks_RI)}
            activeValue={impact}
        />

        <div className="editor-block-riskimpact__descr">
            { values_component.impact.find(item => item.value === impact)?.description }
        </div>
    </div>
}

export default BlockRisk