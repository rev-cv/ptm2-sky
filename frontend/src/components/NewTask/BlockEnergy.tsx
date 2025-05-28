import { useAtomValue } from 'jotai'
import { currentNewTask } from '@utils/jotai.store'

import Expander from '@comps/Expander/Expander'
import IcoEnergyElement from '@asset/energy-element.svg'

function BlockEnergy() {
    const fillingNewTask = useAtomValue(currentNewTask)

    if (!fillingNewTask.energy_level?.length) return null

    return <Expander 
        title='Уровень энергии' 
        onEditData={() => console.log("Уровень энергии")}>
        { 
            fillingNewTask.energy_level?.map((elem, index) => (
                <div className="new-task__energy" key={`task-new--stress-${index}`}>
                    <div className='new-task__energy-title'>
                        <IcoEnergyElement />
                        {elem.name}
                    </div>
                    <div className='new-task__energy-descr'>{elem.description}</div>
                    <div className='new-task__energy-motiv'>{elem.reason}</div>
                </div>
            ))
        }
    </Expander>
}

export default BlockEnergy