import { SetStateAction } from 'jotai'
import { TypeViewTask, TypeTasks_RI } from '@mytype/typeTask'
import { TypeFilterNew } from '@mytype/typeFilters'
import { PagesForTaskEditor as Page } from '@mytype/typeTask'
import valuesForComponents from '@api/valuesForComponents.json'

import BlockMain from './BlockMain'
import BlockSubTasks from './BlockSubTasks'
import BlockTiming from './BlockTiming'
import BlockRisk from './BlockRisk'
import BlockFilters from './BlockFilters'
import BlockAdapt, { TypeAdaptValues } from './BlockAdapt'

import { formatDateString } from '@utils/date-funcs'

import { wsCommander } from '@api/generateTask'

type SetAtom<Args extends any[], Result> = (...args: Args) => Result;

type TypeProps = {
    task: TypeViewTask
    updateTask: SetAtom<[SetStateAction<TypeViewTask>], void>
    activeTab: typeof Page[keyof typeof Page]
    allFilters?: TypeFilterNew[] | undefined
}

const PageSelector = ({task, updateTask, activeTab, allFilters}:TypeProps) : React.ReactNode | null => {
    switch (activeTab) {
        case Page.MAIN:
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
        case Page.STEP:
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
        case Page.TIME:
            return <BlockTiming 
                deadline={task.deadline}
                activation={task.activation}
                taskchecks={task.taskchecks}
                updateDeadline={date => updateTask({...task, deadline: date})}
                updateActivation={date => updateTask({...task, activation: date})}
                updateTaskchecks={dates => updateTask({...task, taskchecks: dates})}
            />
        case Page.RISK:
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
        case Page.THEME:
            return <BlockFilters 
                curList={task.themes}
                allList={allFilters ? allFilters : []}
                type="theme"
                isTheme={true}
                onAddElement={elem => {
                    updateTask({
                        ...task, themes: [...task.themes, elem]
                    })
                }}
                onDelElement={id => {
                    updateTask({
                        ...task, themes: task.themes.filter(elem => elem.idf != id)
                    })
                }}
                onUpdateElement={el => {
                    updateTask({
                        ...task, themes: task.themes.map(elem => elem.idf != el.idf ? elem : el)
                    })
                }}
                onGenerate={async command => {
                    const newTask = await wsCommander(command, task)
                    if (!newTask?.themes) return
                    // нужна проверка на то, что id не добавленных ассоциаций эксклюзивны
                    let contNotAdded = 0
                    const ntc = [...task.themes, ...newTask.themes].map(elem => {
                        if (elem.id < 0) {
                            contNotAdded -= 1
                            elem.id = contNotAdded

                            if (elem.idf < 0) {
                                elem.idf = contNotAdded
                            }
                        }
                        return elem
                    })
                    updateTask({...task, themes: ntc })
                }}
                onRollbackGenerate={oldTheme => {
                    updateTask({...task, themes: oldTheme})
                }}
            />
        case Page.ACTION:
            return <BlockFilters 
                curList={task.actions}
                allList={allFilters ? allFilters : []}
                type="action"
                onAddElement={elem => {
                    updateTask({
                        ...task, actions: [...task.actions, elem]
                    })
                }}
                onDelElement={id => {
                    updateTask({
                        ...task, actions: task.actions.filter(elem => elem.idf != id)
                    })
                }}
                onUpdateElement={el => {
                    updateTask({
                        ...task, actions: task.actions.map(elem => elem.idf != el.idf ? elem : el)
                    })
                }}
                onGenerate={()=>{}}
                onRollbackGenerate={()=>{}}
            />
        case Page.ADAPT:
            const pointAdapt:TypeAdaptValues[] = [
                [
                    valuesForComponents.adapt.stress, 
                    (v:TypeTasks_RI) => updateTask(prev => ({...prev, stress: v})),
                    task.stress
                ],
                [
                    valuesForComponents.adapt.apathy, 
                    (v:TypeTasks_RI) => updateTask(prev => ({...prev, apathy: v})),
                    task.apathy
                ],
                [
                    valuesForComponents.adapt.meditative, 
                    (v:TypeTasks_RI) => updateTask(prev => ({...prev, meditative: v})),
                    task.meditative
                ],
                [
                    valuesForComponents.adapt.comfort, 
                    (v:TypeTasks_RI) => updateTask(prev => ({...prev, comfort: v})),
                    task.comfort
                ],
                [
                    valuesForComponents.adapt.automaticity, 
                    (v:TypeTasks_RI) => updateTask(prev => ({...prev, automaticity: v})),
                    task.automaticity
                ],
                [
                    valuesForComponents.adapt.significance, 
                    (v:TypeTasks_RI) => updateTask(prev => ({...prev, significance: v})),
                    task.significance
                ]
            ]
            return <BlockAdapt 
                description={valuesForComponents.adapt.description}
                points={pointAdapt}
                // onGenerate={() => {}}
                // onRollbackGenerate={() => {}}
            />
        case Page.INTENSITY:
            const pointIntensity:TypeAdaptValues[] = [
                [
                    valuesForComponents.intensity.financial, 
                    (v:TypeTasks_RI) => updateTask(prev => ({...prev, financial: v})),
                    task.financial
                ],
                [
                    valuesForComponents.intensity.temporal, 
                    (v:TypeTasks_RI) => updateTask(prev => ({...prev, temporal: v})),
                    task.temporal
                ],
                [
                    valuesForComponents.intensity.physical, 
                    (v:TypeTasks_RI) => updateTask(prev => ({...prev, physical: v})),
                    task.physical
                ],
                [
                    valuesForComponents.intensity.intellectual, 
                    (v:TypeTasks_RI) => updateTask(prev => ({...prev, intellectual: v})),
                    task.intellectual
                ],
                [
                    valuesForComponents.intensity.emotional, 
                    (v:TypeTasks_RI) => updateTask(prev => ({...prev, emotional: v})),
                    task.emotional
                ],
                [
                    valuesForComponents.intensity.motivational, 
                    (v:TypeTasks_RI) => updateTask(prev => ({...prev, motivational: v})),
                    task.motivational
                ],
                [
                    valuesForComponents.intensity.social, 
                    (v:TypeTasks_RI) => updateTask(prev => ({...prev, social: v})),
                    task.social
                ]
            ]
            return <BlockAdapt 
                description={valuesForComponents.intensity.description}
                points={pointIntensity}
                // onGenerate={() => {}}
                // onRollbackGenerate={() => {}}
            />
        default:
            return null;
    }
}

export default PageSelector