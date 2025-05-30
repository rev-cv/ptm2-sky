import Button from '@comps/Button/Button'
import IcoClose from '@asset/close.svg'
import { formatPeriod } from '@utils/date-funcs'

import IcoStart from '@asset/start.svg'
import IcoCheck from '@asset/check.svg'

type TypeBlockFilterPeriod = {
    start: Date | string | null
    finish: Date | string | null
    tfilter: "activation" | "taskchecks" | "deadline"
    onDelete: () => void
}

const titles = {
    activation: "Задача активирована",
    taskchecks: "Даты проверок",
    deadline: "Дедлайн задачи",
}

function BlockFilterPeriod ({start, finish, onDelete, tfilter}:TypeBlockFilterPeriod) {

    if (!start && !finish) return null

    return <div 
        className='search-panel__filter' 
        onClick={e => e.stopPropagation()}
        title={titles[tfilter] || ""}
        >
        {
            tfilter === "activation" ? 
                <div><IcoStart/></div>
            : tfilter === "deadline" ?
                <div style={{transform: "rotate(180deg)"}}><IcoStart/></div>
            : <div><IcoCheck/></div>
        }
        <div>{formatPeriod(start, finish)}</div>
        <Button 
            IconComponent={IcoClose} 
            onClick={() => onDelete()}
        />
        {/* <span className='search-panel__filter-type'>{tFilter}</span> */}
    </div>
}

export default BlockFilterPeriod