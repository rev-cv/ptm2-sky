import { atomGenRisk, useAtom } from '@utils/jotai.store'
import { TypeTasks_RI } from '@mytype/typeTask'
import { Commands, TypeGenRisk, TypeGenRisk__Fixed } from '@mytype/typesGen'
import values_component from '@api/BlockCriticalityValues.json'

import Toggle from '@comps/Toggles/Toggle'
import TextArea from '@comps/TextArea/TextArea'
import Button from '@comps/Button/Button'

import IcoImpact from '@asset/impact.svg'
import IcoRisk from '@asset/risk.svg'
import IcoMagic from '@asset/magic.svg'
import IcoBack from '@asset/back.svg'
import Loader from '@comps/Loader/Loader'

type TypeProps = {
    risk: TypeTasks_RI
    impact: TypeTasks_RI
    risk_proposals?: string
    risk_explanation?: string
    onChangeRisk: (r:TypeTasks_RI) => void
    onChangeImpact: (i:TypeTasks_RI) => void
    onChangeProp: (text:string) => void
    onChangeExpl: (text:string) => void
    onGenerate: (command: typeof Commands[keyof typeof Commands]) => void
    onRollbackGenerate: (oldRisk:TypeGenRisk__Fixed) => void    
}

function BlockRisk ({risk, impact, risk_proposals="", risk_explanation="",
    onChangeRisk, onChangeImpact, onChangeProp, onChangeExpl, onGenerate, onRollbackGenerate }:TypeProps) {

    const [genRisk, updateGenRisk] = useAtom<TypeGenRisk>(atomGenRisk)
    
    const hundleGenerate = () => {
        if (genRisk.isGen) {
            // остановка генерации
            updateGenRisk({ isGen: false, fixed: null })
            onGenerate(Commands.STOP)
            return
        }

        if (genRisk.fixed) {
            // откат после генерации
            onRollbackGenerate(genRisk.fixed)
            updateGenRisk({ isGen: false, fixed: null })
            return
        }

        // старт генерации
        if (0 < risk || risk_proposals || risk_explanation) {
            updateGenRisk({ isGen: true, fixed: {risk, risk_proposals, risk_explanation}})
        } else {
            updateGenRisk({ isGen: true, fixed: null })
        }
        
        onGenerate(Commands.GEN_RISK)
    }

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
            label='explanation'
            value={risk_explanation}
            onChange={e => onChangeExpl(e.target.value)}
        />

        <TextArea 
            className='editor-block-riskimpact__prop'
            value={risk_proposals}
            label='proposals'
            onChange={e => onChangeProp(e.target.value)}
        />

        <Button 
            icon={
                (genRisk.isGen) ? Loader : 
                (genRisk.fixed) ? IcoBack : IcoMagic
            }
            className="editor-block-riskimpact__gen-btn"
            onClick={hundleGenerate}
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