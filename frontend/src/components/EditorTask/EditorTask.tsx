import { useState } from 'react'
import { useAtomValue, filterFromServer } from "@utils/jotai.store"
import { formatDateString } from '@utils/date-funcs'
import { TypeViewTask, TypeStates } from '@mytype/typeTask'

import BlockDescription from './BlockDescr'
import BlockSubTasks from './BlockSubTasks'
import BlockTiming from './BlockTiming'
import BlockRisk from './BlockRisk'
import BlockFilters from './BlockFilters'

import IcoState from '@asset/state-element.svg'
import IcoStrass from '@asset/stress-element.svg'
import IcoAction from '@asset/event-element.svg'
import IcoTheme from '@asset/theme-element.svg'
import IcoRisk from '@asset/risk.svg'
import IcoCalendar from '@asset/calendar.svg'
import IcoStep from '@asset/subtask.svg'
import IcoDescr from '@asset/title.svg'

import './style.scss'

type TypeProps = {
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

type TypeStateButtons = [string, TypeStates, string]

const stateButtons:TypeStateButtons[] = [
    ["Эмоциональное", "emotional", "Состояние, связанное с чувствами и настроением, влияющее на восприятие и выполнение задачи."],
    ["Интеллектуальное", "intellectual", "Состояние, требующее умственной активности, анализа и логического мышления для решения задачи."],
    ["Мотивационное", "motivational", "Состояние, характеризующееся уровнем вдохновения и желания активно работать над задачей."],
    ["Физическое", "physical", "Состояние, связанное с физической энергией и самочувствием, необходимым для выполнения задачи."],
    ["Социальное", "social", "Состояние, связанное с взаимодействием с другими людьми, влияющее на выполнение задачи в группе или обществе."]
]

function EditorTask ({originakTask}:TypeProps) {

    const [activeTab, setActiveTab] = useState(asideButtons[0][1])
    const [activeState, setActiveState] = useState(stateButtons[0][1])
    const [task, updateTask] = useState({...originakTask})
    const allFilters = useAtomValue(filterFromServer)

    const getPage = () => {
        switch (activeTab) {
            case "descr":
                return <BlockDescription
                    id={task.id}
                    title={task.title}
                    descr={task.description}
                    motiv={task.motivation}
                    created={formatDateString(task.created_at)}
                    onChangeTitle={s => updateTask({...task, title: s})}
                    onChangeDescr={s => updateTask({...task, description: s})}
                    onChangeMotiv={s => updateTask({...task, motivation: s})}
                />
            case "steps":
                return <BlockSubTasks 
                    subtasks={task.subtasks}
                    onUpdate={newOrder => updateTask({...task, subtasks: newOrder})}
                />
            case "timing":
                return <BlockTiming 
                    deadline={task.deadline}
                    activation={task.activation}
                    taskchecks={task.taskchecks}
                    updateDeadline={date => updateTask({...task, deadline: date})}
                    updateActivation={date => updateTask({...task, activation: date})}
                    updateTaskchecks={dates => updateTask({...task, taskchecks: dates})}
                />
            case "risk":
                return <BlockRisk 
                    risk={task.risk}
                    risk_proposals={task.risk_proposals}
                    risk_explanation={task.risk_explanation}
                    impact={task.impact}
                    onChangeRisk={r => updateTask({...task, risk: r})}
                    onChangeImpact={i => updateTask({...task, impact: i})}
                    onChangeProp={text => updateTask({...task, risk_proposals: text})}
                    onChangeExpl={text => updateTask({...task, risk_explanation: text})}
                />
            case "themes":
                return <BlockFilters 
                    allList={allFilters?.theme}
                    curList={task.filters.theme}
                    tt="темы"
                    description="Категории или области, к которым относится задача, например, работа, учеба или личные проекты."
                    onAddElement={elem => {
                        updateTask({
                            ...task, 
                            filters: {
                                ...task.filters, 
                                theme: [...task.filters.theme, elem] 
                            }
                        })
                    }}
                    onDelElement={id => {
                        updateTask({
                            ...task, 
                            filters: {
                                ...task.filters, 
                                theme: task.filters.theme.filter(elem => elem.id != id)
                            }
                        })
                    }}
                    onUpdateElement={el => {
                        updateTask({
                            ...task, 
                            filters: {
                                ...task.filters, 
                                theme: task.filters.theme.map(elem => elem.id != el.id ? elem : el)
                            }
                        })
                    }}
                />
            case "stress":
                return <BlockFilters 
                    allList={allFilters?.stress}
                    curList={task.filters.stress}
                    tt="эмоциональные состояния"
                    description="Эмоции и уровень энергии, которые вызывает процесс выполнения задачи, влияющие на восприятие и мотивацию."
                    onAddElement={elem => {
                        updateTask({
                            ...task, 
                            filters: {
                                ...task.filters, 
                                stress: [...task.filters.stress, elem] 
                            }
                        })
                    }}
                    onDelElement={id => {
                        updateTask({
                            ...task, 
                            filters: {
                                ...task.filters, 
                                stress: task.filters.stress.filter(elem => elem.id != id)
                            }
                        })
                    }}
                    onUpdateElement={el => {
                        updateTask({
                            ...task, 
                            filters: {
                                ...task.filters, 
                                stress: task.filters.stress.map(elem => elem.id != el.id ? elem : el)
                            }
                        })
                    }}
                />
            case "actions":
                return <BlockFilters 
                    allList={allFilters?.action_type}
                    curList={task.filters.action_type}
                    tt="события"
                    description="Характер действий, необходимых для выполнения задачи, таких как анализ, творчество или рутинные операции."
                    onAddElement={elem => {
                        updateTask({
                            ...task, 
                            filters: {
                                ...task.filters, 
                                action_type: [...task.filters.action_type, elem] 
                            }
                        })
                    }}
                    onDelElement={id => {
                        updateTask({
                            ...task, 
                            filters: {
                                ...task.filters, 
                                action_type: task.filters.action_type.filter(elem => elem.id != id)
                            }
                        })
                    }}
                    onUpdateElement={el => {
                        updateTask({
                            ...task, 
                            filters: {
                                ...task.filters, 
                                action_type: task.filters.action_type.map(elem => elem.id != el.id ? elem : el)
                            }
                        })
                    }}
                />
            case "states":
                return <div>
                    <div>{
                        stateButtons.map(elem => (
                            <button onClick={() => setActiveState(elem[1])}>{elem[0]}</button>
                        ))
                    }</div>
                    <BlockFilters 
                        allList={allFilters?.state[activeState]}
                        curList={task.filters.state[activeState]}
                        tt="состояния"
                        description="Условия (эмоциональное настроение, физическая энергия, окружающая обстановка), оптимальные для успешного выполнения задачи."
                        onAddElement={elem => {
                            updateTask({
                                ...task, 
                                filters: {
                                    ...task.filters, 
                                    action_type: [...task.filters.action_type, elem] 
                                }
                            })
                        }}
                        onDelElement={id => {
                            updateTask({
                                ...task, 
                                filters: {
                                    ...task.filters, 
                                    action_type: task.filters.action_type.filter(elem => elem.id != id)
                                }
                            })
                        }}
                        onUpdateElement={el => {
                            updateTask({
                                ...task, 
                                filters: {
                                    ...task.filters, 
                                    action_type: task.filters.action_type.map(elem => elem.id != el.id ? elem : el)
                                }
                            })
                        }}
                    />
                </div>
            default:
                break;
        }
    }

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
            { getPage() }
        </div>
    </div>
}

export default EditorTask