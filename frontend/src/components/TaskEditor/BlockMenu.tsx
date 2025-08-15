import { PagesForTaskEditor as Page } from '@mytype/typeTask'

import Button from '@comps/Button/Button'

import IcoAction from '@asset/event-element.svg'
import IcoTheme from '@asset/theme-element.svg'
import IcoRisk from '@asset/risk.svg'
import IcoCalendar from '@asset/calendar.svg'
import IcoStep from '@asset/subtask.svg'
import IcoDescr from '@asset/title.svg'
import IcoDelete from '@asset/delete.svg'
import IcoAdapt from '@asset/adaptability.svg'
import IcoResource from '@asset/resource.svg'

type TypeAsideButton = [
    string, 
    number, 
    string | React.FunctionComponent<any> | React.ComponentType<any>
]

export const asideButtons:TypeAsideButton[] = [
    ["Описание задачи", Page.MAIN, IcoDescr],
    ["Разбивка по шагам", Page.STEP, IcoStep],
    ["Тайминг сроков", Page.TIME, IcoCalendar],
    ["Оценка критичности", Page.RISK, IcoRisk],
    ["Темы", Page.THEME, IcoTheme],
    ["Вид деятельности", Page.ACTION, IcoAction],
    ["Ресурсоемкость", Page.INTENSITY, IcoResource],
    ["Адаптивность", Page.ADAPT, IcoAdapt],
]

type TypeProps = {
    activeTab: number
    isEdit?: boolean
    onChangeTab: (activeTab:number) => void
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