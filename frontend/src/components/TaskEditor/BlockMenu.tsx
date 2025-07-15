import Button from '@comps/Button/Button'

import IcoState from '@asset/state-element.svg'
import IcoStrass from '@asset/stress-element.svg'
import IcoAction from '@asset/event-element.svg'
import IcoTheme from '@asset/theme-element.svg'
import IcoRisk from '@asset/risk.svg'
import IcoCalendar from '@asset/calendar.svg'
import IcoStep from '@asset/subtask.svg'
import IcoDescr from '@asset/title.svg'
import IcoDelete from '@asset/delete.svg'

export const asideButtons = [
    ["Описание задачи", "", IcoDescr],
    ["Разбивка по шагам", "steps", IcoStep],
    ["Тайминг сроков", "timing", IcoCalendar],
    ["Оценка критичности", "risk", IcoRisk],
    ["Темы", "themes", IcoTheme],
    ["Состояния", "states", IcoState],
    ["Эмоциональная нагрузка", "stress", IcoStrass],
    ["Типы действий", "actions", IcoAction],
]

type TypeProps = {
    activeTab: string
    isEdit?: boolean
    onChangeTab: (activeTab:string) => void
    onDeleteTask?: () => void
}

function BlockMenu ({activeTab, isEdit=false, onChangeTab, onDeleteTask}:TypeProps) {

    return <div className="editor-task__menu">
        {
            asideButtons.map((item, index) => {
                const Icon = item[2]
                return <button
                    className={item[1] === activeTab ? 'active' : ""}
                    onClick={() => onChangeTab(item[1])}
                    key={`editor-task-menu-${index}=${item[1]}`}
                    ><Icon /> {item[0]}
                </button>
            })
        }

        {
            isEdit ? <div className='editor-task__menu__bottom'>
                <Button
                    text='Delete'
                    icon={IcoDelete}
                    variant='remove'
                    onClick={() => onDeleteTask && onDeleteTask()}
                />
            </div> : null
        }
        
    </div>
}

export default BlockMenu