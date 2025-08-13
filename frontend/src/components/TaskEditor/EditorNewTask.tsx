import { useState } from 'react'
import { currentNewTask2, isOpenNewTaskEditor, openedTabsTaskEditor, atomThemeList, atomStressList, atomActionList, atomStateDict, resetTask2, useAtom, useAtomValue } from '@utils/jotai.store'
import { createTask } from '@api/createTask'
import { wsCommander } from '@api/generateTask'

import { TypeFilterNew__Tabs } from '@mytype/typeFilters'

import Button from '@comps/Button/Button'
import Modal from '@comps/Modal/Modal'
import BlockMenu from './BlockMenu'
import BlockMain from './BlockMain'
import BlockSubTasks from './BlockSubTasks'
import BlockTiming from './BlockTiming'
import BlockRisk from './BlockRisk'
import BlockFilters from './BlockFilters'

import IcoAdd from '@asset/add.svg'
// import IcoMagic from '@asset/magic.svg'
import IcoClean from '@asset/clean.svg'

import { formatDateString } from '@utils/date-funcs'

function EditorNewTask () {
    const [visible, setVisible] = useState(true)
    const [isOpen, setStatus] = useAtom(isOpenNewTaskEditor)
    const [activeTab, setActiveTab] = useAtom(openedTabsTaskEditor)
    const [task, updateTask] = useAtom(currentNewTask2)

    const themeList = useAtomValue(atomThemeList)
    const stressList = useAtomValue(atomStressList)
    const actionList = useAtomValue(atomActionList)
    const stateDict = useAtomValue(atomStateDict)

    if (!isOpen) return

    const getPage = () => {
        switch (activeTab) {
            case "":
                return <BlockMain
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
                    onGenerate={async command => {
                        const newTask = await wsCommander(command, task)
                        if (!newTask) return
                        updateTask({...task, motivation: newTask.motivation })
                    }}
                    onRollbackGenerate={oldMotive => {
                        updateTask({...task, motivation: oldMotive})
                    }}
                />
            case "steps":
                return <BlockSubTasks 
                    subtasks={task.subtasks}
                    onUpdate={newOrder => updateTask({...task, subtasks: newOrder})}
                    onGenerate={async command => {
                        const newTask = await wsCommander(command, task)
                        if (!newTask) return
                        updateTask({...task, subtasks: [...newTask.subtasks] })
                    }}
                    onRollbackGenerate={oldMotive => {
                        updateTask({...task, subtasks: [...oldMotive]})
                    }}
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
                    onGenerate={async command => {
                        const newTask = await wsCommander(command, task)
                        if (!newTask) return
                        updateTask({...task, 
                            risk: newTask.risk, 
                            risk_proposals: newTask.risk_proposals,
                            risk_explanation: newTask.risk_explanation 
                        })
                    }}
                    onRollbackGenerate={oldRisk => {
                        updateTask({...task, 
                            risk:oldRisk.risk, 
                            risk_proposals:oldRisk.risk_proposals,
                            risk_explanation: oldRisk.risk_explanation
                        })
                    }}
                />
            case "themes":
                return <BlockFilters 
                    allList={themeList}
                    curList={task.filters.theme}
                    type="theme"
                    isTheme={true}
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
                    onGenerate={async command => {
                        const newTask = await wsCommander(command, task)
                        if (!newTask?.filters?.theme) return
                        // нужна проверка на то, что id не добавленных ассоциаций эксклюзивны
                        let contNotAdded = 0
                        const ntc = [...task.filters.theme, ...newTask.filters.theme].map(elem => {
                            if (elem.id < 0) {
                                contNotAdded -= 1
                                elem.id = contNotAdded

                                if (elem.idf < 0) {
                                    elem.idf = contNotAdded
                                }
                            }
                            return elem
                        })
                        updateTask({...task, 
                            filters: {
                                ...task.filters,
                                theme: ntc
                            }
                        })
                    }}
                    onRollbackGenerate={oldTheme => {
                        updateTask({...task, 
                            filters: {
                                ...task.filters,
                                theme: oldTheme
                            }
                        })
                    }}
                />
            case "stress":
                return <BlockFilters 
                    allList={stressList}
                    curList={task.filters.stress}
                    type="stress"
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
                    onGenerate={()=>{}}
                    onRollbackGenerate={()=>{}}
                />
            case "actions":
                return <BlockFilters 
                    allList={actionList}
                    curList={task.filters.action_type}
                    type="action"
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
                    onGenerate={()=>{}}
                    onRollbackGenerate={()=>{}}
                />
            case "states":
                const statelist:TypeFilterNew__Tabs[] = [
                    {
                        tabname: "Эмоциональное",
                        sysname: "emotional",
                        descr: "Состояние, связанное с чувствами и настроением, влияющее на восприятие и выполнение задачи.",
                        allList: stateDict.emotional
                    },
                    {
                        tabname: "Интеллектуальное",
                        sysname: "intellectual",
                        descr: "Состояние, требующее умственной активности, анализа и логического мышления для решения задачи.",
                        allList: stateDict.intellectual
                    },
                    {
                        tabname: "Мотивационное",
                        sysname: "motivational",
                        descr: "Состояние, характеризующееся уровнем вдохновения и желания активно работать над задачей.",
                        allList: stateDict.motivational
                    },
                    {
                        tabname: "Физическое",
                        sysname: "physical",
                        descr: "Состояние, связанное с физической энергией и самочувствием, необходимым для выполнения задачи.",
                        allList: stateDict.physical
                    },
                    {
                        tabname: "Социальное",
                        sysname: "social",
                        descr: "Состояние, связанное с взаимодействием с другими людьми, влияющее на выполнение задачи в группе или обществе.",
                        allList: stateDict.social
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
                    type="state"
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
                    onGenerate={()=>{}}
                    onRollbackGenerate={()=>{}}
                />
            default:
                break;
        }
    }

    return <Modal
        visible={visible}
        onRequestClose={() => setVisible(false)}
        onExited={() => {
            setStatus(false)
            setVisible(true)
        }}>
        <div className="editor-task">
            <BlockMenu
                activeTab={activeTab}
                onChangeTab={activeTab => setActiveTab(activeTab)}
            />

            <div className="editor-task__content">
                { getPage() }
            </div>

            <div className='editor-task__bottom-btns'>
                {/* <Button
                    icon={IcoMagic}
                    onClick={() => generateTask(task, 'gen')}
                    disabled={ task.title.length < 6 }
                /> */}
    
                <Button
                    text="Create task"
                    icon={IcoAdd}
                    onClick={() => {
                        createTask()
                        setStatus(false)
                        setActiveTab("")
                    }}
                    disabled={task.title.length < 6}
                />

                <Button
                    icon={IcoClean}
                    className='editor-task__bottom-btns-clean'
                    variant='second'
                    onClick={() => {
                        updateTask(structuredClone(resetTask2))
                    }}
                />
            </div>
        </div>

    </Modal>
}

export default EditorNewTask