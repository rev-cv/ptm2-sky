import { useAtom, searchRequest } from '@utils/jotai.store'
import { TypeRiskImpact } from '@mytype/typeSearchAndFilter'

import IcoImpact from '@asset/impact.svg'
import IcoRisk from '@asset/risk.svg'

import Expander from '@comps/Expander/Expander'
import CheckBox from '@comps/CheckBox/CheckBox'

import values_component from '@comps/NewTask/BlockCriticalityValues.json'

function BlockCritical () {
    
    const [search, updateSearch] = useAtom(searchRequest)

    return <Expander title='Критичность'>
        <div className="new-task__energy">
            <div className='new-task__energy-title'>
                <IcoRisk />
                Риски невыполнения
            </div>
            <div className='filter-panel__assoc'>
                {
                    values_component.risk.map((elem, index) => (
                        elem.value != 0 ?
                        <CheckBox 
                            title={elem.label} 
                            key={`rpf-${index}-value${elem.value}`}
                            onChangeStatus={state => {
                                let new_risk = [...search.risk]
                                if (state) {
                                    new_risk.push(elem.value as TypeRiskImpact)
                                } else {
                                    new_risk = new_risk.filter(el => el != elem.value)
                                }
                                updateSearch({...search, risk: new_risk})
                            }}
                            state={search.risk?.includes(elem.value as TypeRiskImpact)}
                            desciption={elem.description}
                        />
                        : null
                    ))
                }
            </div>
        </div>

        <div className="new-task__energy">
            <div className='new-task__energy-title'>
                <IcoImpact />
                Последствия невыполнения
            </div>
            <div className='filter-panel__assoc'>
                {
                    values_component.impact.map((elem, index) => (
                        elem.value != 0 ?
                        <CheckBox 
                            title={elem.label} 
                            key={`rpf-${index}-value${elem.value}`}
                            onChangeStatus={state => {
                                let new_impact = [...search.impact]
                                if (state) {
                                    new_impact.push(elem.value as TypeRiskImpact)
                                } else {
                                    new_impact = new_impact.filter(el => el != elem.value)
                                }
                                updateSearch({...search, impact: new_impact})
                            }}
                            state={search.impact?.includes(elem.value as TypeRiskImpact)}
                            desciption={elem.description}
                        />
                        : null 
                    ))
                }
            </div>
        </div>
    </Expander>
}

export default BlockCritical