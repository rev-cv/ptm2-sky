import { useState, useEffect, useRef } from 'react'
import { useAtomValue, filterFromServer } from "@utils/jotai.store"
import { formatDateString } from '@utils/date-funcs'
import { TypeViewTask } from '@mytype/typeTask'

import BlockDescription from './BlockDescr'
import BlockSubTasks from './BlockSubTasks'
import BlockTiming from './BlockTiming'
import BlockRisk from './BlockRisk'
import BlockFilters, {TypeFilterServer__Tabs} from './BlockFilters'

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
    onExit?: (editedTask:TypeViewTask) => void
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

function EditorTask ({originakTask, onExit}:TypeProps) {

    const [activeTab, setActiveTab] = useState(asideButtons[0][1])
    const [task, updateTask] = useState({...originakTask})
    const onExitRef = useRef(onExit);
    const mountedRef = useRef(true); // флаг монтирования
    const allFilters = useAtomValue(filterFromServer)

    useEffect(() => { onExitRef.current = onExit }, [onExit])

    useEffect(() => {
        mountedRef.current = true
        return () => {
            setTimeout(() => {
                if (!mountedRef.current && onExitRef.current) {
                    onExitRef.current({ ...task });
                }
            }, 0);
            mountedRef.current = false;
        };
    }, []);

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
                const statelist:TypeFilterServer__Tabs[] = [
                    {
                        tabname: "Эмоциональное",
                        sysname: "emotional",
                        descr: "Состояние, связанное с чувствами и настроением, влияющее на восприятие и выполнение задачи.",
                        allList: allFilters?.state.emotional
                    },
                    {
                        tabname: "Интеллектуальное",
                        sysname: "intellectual",
                        descr: "Состояние, требующее умственной активности, анализа и логического мышления для решения задачи.",
                        allList: allFilters?.state.intellectual
                    },
                    {
                        tabname: "Мотивационное",
                        sysname: "motivational",
                        descr: "Состояние, характеризующееся уровнем вдохновения и желания активно работать над задачей.",
                        allList: allFilters?.state.motivational
                    },
                    {
                        tabname: "Физическое",
                        sysname: "physical",
                        descr: "Состояние, связанное с физической энергией и самочувствием, необходимым для выполнения задачи.",
                        allList: allFilters?.state.physical
                    },
                    {
                        tabname: "Социальное",
                        sysname: "social",
                        descr: "Состояние, связанное с взаимодействием с другими людьми, влияющее на выполнение задачи в группе или обществе.",
                        allList: allFilters?.state.social
                    }
                ]

                const addedFilters = [
                    ...task.filters.state.emotional,
                    ...task.filters.state.intellectual,
                    ...task.filters.state.motivational,
                    ...task.filters.state.physical,
                    ...task.filters.state.social,
                ]

                return <BlockFilters 
                    tabList={statelist}
                    curList={addedFilters}
                    tt="состояния"
                    description="Условия (эмоциональное настроение, физическая энергия, окружающая обстановка), оптимальные для успешного выполнения задачи."
                    onAddElement={(elem, tab) => {
                        const state = {...task.filters.state}
                        if (tab) {
                            state[tab] = [...state[tab], elem]
                        }
                        
                        updateTask({ 
                            ...task, filters: {
                                ...task.filters, state
                            }
                        })
                    }}
                    onDelElement={id => {
                        updateTask({
                            ...task, 
                            filters: {
                                ...task.filters, 
                                state: {
                                    emotional: task.filters.state.emotional.filter(elsel => elsel.id != id),
                                    intellectual: task.filters.state.intellectual.filter(elsel => elsel.id != id),
                                    motivational: task.filters.state.motivational.filter(elsel => elsel.id != id),
                                    physical: task.filters.state.physical.filter(elsel => elsel.id != id),
                                    social: task.filters.state.social.filter(elsel => elsel.id != id)
                                }
                            }
                        })
                    }}
                    onUpdateElement={el => {
                        updateTask({
                            ...task, 
                            filters: {
                                ...task.filters, 
                                state: {
                                    emotional: task.filters.state.emotional.map(elem => elem.id != el.id ? elem : el),
                                    intellectual: task.filters.state.intellectual.map(elem => elem.id != el.id ? elem : el),
                                    motivational: task.filters.state.motivational.map(elem => elem.id != el.id ? elem : el),
                                    physical: task.filters.state.physical.map(elem => elem.id != el.id ? elem : el),
                                    social: task.filters.state.social.map(elem => elem.id != el.id ? elem : el)
                                }
                            }
                        })
                    }}
                />
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