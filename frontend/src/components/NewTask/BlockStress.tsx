import { useAtomValue } from 'jotai'
import { currentNewTask } from '@utils/jotai.store'

import Expander from '@comps/Expander/Expander'
import IcoStressElement from '@asset/stress-element.svg'

function BlockStress() {
    const fillingNewTask = useAtomValue(currentNewTask)

    if (!fillingNewTask.stress?.length) return null

    return <Expander 
        title='Эмоциональная нагрузка' 
        onEditData={() => console.log("Эмоциональная нагрузка")}>
        { 
            fillingNewTask.stress?.map((elem, index) => (
                <div className="new-task__theme-elem" key={`task-new--stress-${index}`}>
                    <div className='new-task__theme-elem-title'>
                        <IcoStressElement />
                        {elem.name}
                    </div>
                    <div className='new-task__subtask-descr'>{elem.description}</div>
                    <div className='new-task__subtask-motiv'>{elem.reason}</div>
                </div>
            ))
        }
    </Expander>
}

export default BlockStress