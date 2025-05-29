import { useAtom } from 'jotai'
import { currentNewTask } from '@utils/jotai.store'
import { sortDates } from '@utils/date-funcs'

import Expander from '@comps/Expander/Expander'
import ButtonCalendar from '@comps/ButtonCalendar/ButtonCalendar'

import IcoAdd from '@asset/add.svg'
import IcoStart from '@asset/start.svg'
import IcoCheck from '@asset/check.svg'

function BlockEnergy() {
    const [fillingNewTask, updateNewTask] = useAtom(currentNewTask)

    // if (!fillingNewTask.energy_level?.length) return null

    function updateChecksDates(value:string, index: number) {
        let newTaskchecks: string[] = []
        if (!fillingNewTask.taskchecks) return null

        newTaskchecks = [...fillingNewTask.taskchecks]
        newTaskchecks[index] = value

        const dates = sortDates(newTaskchecks)

        updateNewTask({...fillingNewTask, taskchecks: dates})
    }

    return <Expander title='Тайминг сроков'>
        <div className="new-task__activate">
            <div className='new-task__activate-title'>
                <IcoStart />
                Дата активации задачи
            </div>
            <ButtonCalendar
                defaultDate='Activation at creation time'
                onClickDay={
                    (value) => updateNewTask({...fillingNewTask, activation: value})
                }
            />
            {/* {
                fillingNewTask.activation && 
                    <span className='new-task__activate-time_diff'>
                        {getDaysDifference(fillingNewTask.activation)} days
                    </span>
            } */}
            <div className='new-task__deadline-motiv'>
                Дата, когда задача становится доступной для выполнения.
            </div>
        </div>

        <div className="new-task__deadline">
            <div className='new-task__deadline-title'>
                <IcoStart />
                Дата дедлайна задачи
            </div>
            <ButtonCalendar
                defaultDate='No deadline'
                onClickDay={
                    (value) => updateNewTask({...fillingNewTask, deadline: value})
                }
            />
            {/* {
                fillingNewTask.deadline && 
                    <span className='new-task__deadline-time_diff'>
                        {getDaysDifference(fillingNewTask.deadline)} days
                    </span>
            } */}
        </div>

        <div className="new-task__taskchecks">
            <div className='new-task__taskchecks-title'>
                <IcoCheck />
                Даты проверок задачи
            </div>
            {
                fillingNewTask.taskchecks && fillingNewTask.taskchecks.map((_, index) => (
                    <div className='new-task__taskchecks-time' key={`data-check-${index}`}>
                            <ButtonCalendar
                                defaultDate='Date not set'
                                onClickDay={value => updateChecksDates(value, index)}
                            />
                            {/* {
                                datestr && 
                                    <span className='new-task__taskchecks-time_diff'>
                                        {getDaysDifference(datestr)} days
                                    </span>
                            } */}
                    </div>
                ))
            }
            <button 
                className='new-task__taskchecks__add'
                onClick={
                    () => updateNewTask({
                        ...fillingNewTask, 
                        taskchecks: [
                            ...(fillingNewTask.taskchecks ? fillingNewTask.taskchecks : []), ""
                        ]
                    })}
                ><IcoAdd />
            </button>
        </div>
    </Expander>
}

export default BlockEnergy