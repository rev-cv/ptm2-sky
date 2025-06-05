import { useAtomValue, currentNewTask } from '@utils/jotai.store'

import Expander from '@comps/Expander/Expander'
import IcoSubTaskPoint from '@asset/task_point.svg'

function BlockThemes() {
    const fillingNewTask = useAtomValue(currentNewTask)

    // if (!fillingNewTask.subtasks?.length) return null

    return <Expander title='Разбивка по шагам' onEditData={() => console.log(1)}>
        {
            fillingNewTask.subtasks?.length ?
                fillingNewTask.subtasks?.map((elem, i) => 
                    <div className="new-task__subtask" key={`new-task__subtask-${i}`}>

                        <div className='new-task__subtask-title'>
                            <IcoSubTaskPoint />{elem.title}
                        </div>

                        <div className='new-task__subtask-motiv'>
                            {elem.motivation}
                        </div>

                        <div className='new-task__subtask-descr'>
                            {elem.description}
                        </div>

                        <div className='new-task__subtask-instr'>
                            {elem.instruction}
                        </div>

                        <div className='new-task__subtask-hours'>
                            Время выполнения: ~{elem.continuance}h
                        </div>

                    </div>
                )
                : <div className='new-task__no-data'>no data</div>
        }
    </Expander>
}

export default BlockThemes