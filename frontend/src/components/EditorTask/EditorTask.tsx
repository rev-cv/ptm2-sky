import { useState } from 'react'
import { useAtomValue, filterFromServer } from "@utils/jotai.store"
import { formatDateString } from '@utils/date-funcs'
import { TypeViewTask } from '@mytype/typeTask'

import Modal from '@comps/Modal/Modal'
import BlockMenu, { asideButtons } from './BlockMenu'
import BlockDescription from './BlockDescr'
import BlockSubTasks from './BlockSubTasks'
import BlockTiming from './BlockTiming'
import BlockRisk from './BlockRisk'
import BlockFilters, {TypeFilterServer__Tabs} from './BlockFilters'

import './style.scss'

type TypeProps = {
    originakTask: TypeViewTask
    onExit?: (editedTask:TypeViewTask) => void
    onDelete?: () => void
}

function EditorTask ({originakTask, onExit, onDelete}:TypeProps) {

    const [activeTab, setActiveTab] = useState(asideButtons[0][1])
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
                    status={task.status}
                    created={formatDateString(task.created_at)}
                    onChangeTitle={s => updateTask({...task, title: s})}
                    onChangeDescr={s => updateTask({...task, description: s})}
                    onChangeMotiv={s => updateTask({...task, motivation: s})}
                    onChangeStatus={b => updateTask({...task, status: b})}
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
                                theme: task.filters.theme.filter(elem => elem.idf != id)
                            }
                        })
                    }}
                    onUpdateElement={el => {
                        updateTask({
                            ...task, 
                            filters: {
                                ...task.filters, 
                                theme: task.filters.theme.map(elem => elem.idf != el.idf ? elem : el)
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
                                stress: task.filters.stress.filter(elem => elem.idf != id)
                            }
                        })
                    }}
                    onUpdateElement={el => {
                        updateTask({
                            ...task, 
                            filters: {
                                ...task.filters, 
                                stress: task.filters.stress.map(elem => elem.idf != el.idf ? elem : el)
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
                                action_type: task.filters.action_type.filter(elem => elem.idf != id)
                            }
                        })
                    }}
                    onUpdateElement={el => {
                        updateTask({
                            ...task, 
                            filters: {
                                ...task.filters, 
                                action_type: task.filters.action_type.map(elem => elem.idf != el.idf ? elem : el)
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
                                    emotional: task.filters.state.emotional.filter(elsel => elsel.idf != id),
                                    intellectual: task.filters.state.intellectual.filter(elsel => elsel.idf != id),
                                    motivational: task.filters.state.motivational.filter(elsel => elsel.idf != id),
                                    physical: task.filters.state.physical.filter(elsel => elsel.idf != id),
                                    social: task.filters.state.social.filter(elsel => elsel.idf != id)
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
                                    emotional: task.filters.state.emotional.map(
                                        elem => elem.idf != el.idf ? elem : el
                                    ),
                                    intellectual: task.filters.state.intellectual.map(
                                        elem => elem.idf != el.idf ? elem : el
                                    ),
                                    motivational: task.filters.state.motivational.map(
                                        elem => elem.idf != el.idf ? elem : el
                                    ),
                                    physical: task.filters.state.physical.map(
                                        elem => elem.idf != el.idf ? elem : el
                                    ),
                                    social: task.filters.state.social.map(
                                        elem => elem.idf != el.idf ? elem : el
                                    )
                                }
                            }
                        })
                    }}
                />
            default:
                break;
        }
    }

    return <Modal 
        title={`[${task.id}] ${task.title}`}
        onClose={() => { if (onExit) onExit(task) }}
    >
    
        <div className="editor-task">
            <BlockMenu
                isEdit={true}
                activeTab={activeTab}
                onChangeTab={activeTab => setActiveTab(activeTab)}
                onDeleteTask={() => onDelete && onDelete()}
            />

            <div className="editor-task__content">
                { getPage() }
            </div>
        </div>

    </Modal>
}

export default EditorTask