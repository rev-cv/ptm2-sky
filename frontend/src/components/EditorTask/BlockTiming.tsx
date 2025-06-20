import ButtonCalendar from '@comps/ButtonCalendar/ButtonCalendar'
import Button from '@comps/Button/Button'

import IcoStart from '@asset/start.svg'
import IcoCheck from '@asset/check.svg'
import IcoAdd from '@asset/add.svg'

type TypeProps = {
    deadline: string | null
    activation: string | null
    taskchecks: string[]
    updateDeadline: (ds:string) => void
    updateActivation: (ds:string) => void
    updateTaskchecks: (ds:string[]) => void
}



function BlockTiming ({deadline, activation, taskchecks,
    updateDeadline, updateActivation, updateTaskchecks} : TypeProps ) {

    return <div className="editor-task__block editor-task__block-timing">

        <div className='editor-task__block-timing__title'>
            <IcoStart /><span>Дата активации</span>
        </div>

        <div className="editor-task__block-timing__descr">
            Дата, когда задача становится активной и доступной для выполнения.
        </div>
        
        <ButtonCalendar 
            date={activation}
            onClickDay={value => updateActivation(value)}
        />

        <div className='editor-task__block-timing__d'></div>


        <div className='editor-task__block-timing__title ico-deadline'>
            <IcoStart /><span>Дата дедлайна</span>
        </div>

        <div className="editor-task__block-timing__descr">
            Крайний срок, к которому задача должна быть завершена.
        </div>
        
        <ButtonCalendar 
            date={deadline}
            onClickDay={value => updateDeadline(value)}
        />

        <div className='editor-task__block-timing__d'></div>


        <div className='editor-task__block-timing__title'>
            <IcoCheck /><span>Даты проверок задачи</span>
        </div>

        <div className="editor-task__block-timing__descr">
            Даты, когда запланированы напоминания или проверки прогресса по задаче.
        </div>
        
        {
            taskchecks.map((ds, index) => (
                <ButtonCalendar 
                    date={ds}
                    onClickDay={value => {
                        const ntsd = [...taskchecks]
                        ntsd[index] = value
                        updateTaskchecks(ntsd)
                    }}
                />
            ))
        }

        <Button
            IconComponent={IcoAdd}
            onClick={() => updateTaskchecks([
                ...taskchecks, new Date(Date.now() + 86400000).toString()
            ])}
            title='add new subtask'
        />

    </div>
}

export default BlockTiming