import { TypeViewTask } from '@mytype/typeTask'
import { formatDateString } from '@utils/date-funcs'
import './style.scss'

import ProgressCircle from '@comps/ProgressCircle/ProgressCircle'

import IcoCalendar from '@asset/calendar.svg'
import IcoRisk from '@asset/risk.svg'
import IcoImpact from '@asset/impact.svg'

type TaskProps = {
    objTask: TypeViewTask;
}

function Task({objTask} : TaskProps) {

    const deadline = objTask.deadline ? new Date(objTask.deadline) : null;
    const deadlaneDiff = deadline ? Math.floor((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
    const deadlineClass = deadlaneDiff != null && 
        deadlaneDiff < 1 ? "day_1" 
        : deadlaneDiff && deadlaneDiff < 3 ? "days_3"
        : deadlaneDiff && deadlaneDiff < 7 ? "week_1"
        : deadlaneDiff && deadlaneDiff < 14 ? "week_2"
        : "in_near_future";

    return (<div className={`task-list__item`}>
        <div className="task-list__item__title">{objTask.title}</div>
        <div className="task-list__item__description">{objTask.description}</div>
        <div className="task-list__item__description">{objTask.motivation}</div>
        {
            objTask.deadline &&
                <div className={`task-list__item__deadline ${deadlineClass}`}>
                    <IcoCalendar />
                    { deadline ? <span>{formatDateString(deadline)}</span> : "" }
                    { deadlaneDiff != null ? <span className='days'>{`(${deadlaneDiff} days)`}</span> : "" }
                </div>
        }

        <div className="task-list__item__onside">
            {
                (objTask.risk && 0 < objTask.risk) ?
                    <ProgressCircle value={2} Icon={IcoRisk} title={`risk ${objTask.risk}`} /> : null
            }
            {
                (objTask.impact && 0 < objTask.impact) ?
                    <ProgressCircle value={3} Icon={IcoImpact} title={`impact ${objTask.impact}`} /> : null
            }
        </div>
        
    </div>)
}

export default Task