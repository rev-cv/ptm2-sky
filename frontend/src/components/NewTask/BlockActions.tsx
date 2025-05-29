import { useAtomValue } from 'jotai'
import { currentNewTask } from '@utils/jotai.store'

import Expander from '@comps/Expander/Expander'
import IcoAction from '@asset/event.svg'

function BlockAction() {
    const fillingNewTask = useAtomValue(currentNewTask)

    // if (!fillingNewTask.stress?.length) return null

    return <Expander 
        title='Типы действия' 
        onEditData={() => console.log("Типы действия")}>
        { 
            fillingNewTask.action_type?.length ?
                fillingNewTask.action_type?.map((elem, index) => (
                    <div className="new-task__theme-elem" key={`task-new--stress-${index}`}>
                        <div className='new-task__theme-elem-title'>
                            <IcoAction />
                            {elem.name}
                        </div>
                        <div className='new-task__subtask-descr'>{elem.description}</div>
                        <div className='new-task__subtask-motiv'>{elem.reason}</div>
                    </div>
                ))
            : <div className='new-task__no-data'>no data</div>
        }
    </Expander>
}

export default BlockAction