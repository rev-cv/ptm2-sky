import { useState } from 'react'
import { formatDateString } from '@utils/date-funcs'
import { TypeViewTask } from '@mytype/typeTask'

import BlockDescription from './BlockDescr'
import BlockSubTasks from './BlockSubTasks'

import IcoState from '@asset/state-element.svg'
import IcoStrass from '@asset/stress-element.svg'
import IcoAction from '@asset/event-element.svg'
import IcoTheme from '@asset/theme-element.svg'
import IcoRisk from '@asset/risk.svg'
import IcoCalendar from '@asset/calendar.svg'
import IcoStep from '@asset/subtask.svg'
import IcoDescr from '@asset/title.svg'

import './style.scss'

type TypeEditorTask = {
    originakTask: TypeViewTask
}

const asideButtons = [
    ["Описание задачи", "descr", IcoDescr],
    ["Разбивка по шагам", "steps", IcoStep],
    ["Тайминг сроков", "timing", IcoCalendar],
    ["Оценка критичности", "risk", IcoRisk],
    ["Темы", "themes", IcoTheme],
    ["Состояния", "states", IcoState],
    ["Эмоциональная нагрузка", "stress", IcoStrass],
    ["Типы действий", "actions", IcoAction],
]

function EditorTask ({originakTask}:TypeEditorTask) {

    const [activeTab, setActiveTab] = useState(asideButtons[0][1])
    const [task, updateTask] = useState({...originakTask})

    return <div className="editor-task">

        <div className="editor-task__menu">
            {
                asideButtons.map((item, index) => {
                    const Icon = item[2]
                    return <button
                        className={item[1] === activeTab ? 'active' : ""}
                        onClick={() => setActiveTab(item[1])}
                        key={`editor-task-menu-${index}=${item[1]}`}
                        ><Icon /> {item[0]}
                    </button>
                })
            }
        </div>

        <div className="editor-task__content">
            { activeTab === "descr" ? 
                <BlockDescription
                    id={task.id}
                    title={task.title}
                    descr={task.description}
                    motiv={task.motivation}
                    created={formatDateString(task.created_at)}
                    onChangeTitle={s => updateTask({...task, title: s})}
                    onChangeDescr={s => updateTask({...task, description: s})}
                    onChangeMotiv={s => updateTask({...task, motivation: s})}
                /> : null }
            
            { activeTab === "steps" ?
                <BlockSubTasks 
                    subtasks={task.subtasks}
                    onUpdate={newOrder => updateTask({...task, subtasks: newOrder})}
                /> : null }
        </div>
    </div>
}

export default EditorTask