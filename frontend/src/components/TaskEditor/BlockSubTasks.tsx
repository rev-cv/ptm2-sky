import React, { useState } from 'react';
import { TypeTasks_SubTask } from '@mytype/typeTask'
import { atomGenSteps, useAtom } from '@utils/jotai.store'

import CheckBoxTask from '@comps/CheckBox/CheckBoxTask'
import TextArea from '@comps/TextArea/TextArea'
import Button from '@comps/Button/Button'

import IcoGrid from '@asset/grid.svg'
import IcoAdd from '@asset/add.svg'
import IcoRemove from '@asset/close.svg'
import IcoMagic from '@asset/magic.svg'
import IcoBack from '@asset/back.svg'
import Loader from '@comps/Loader/Loader'

type TypeProps = {
    subtasks: TypeTasks_SubTask[]
    onUpdate: (newOrder: TypeTasks_SubTask[]) => void
    onGenerate: (typeGen:string) => void
    onRollbackGenerate: (oldSteps:TypeTasks_SubTask[]) => void
}

function BlockSubTasks({ subtasks, onUpdate, onGenerate, onRollbackGenerate }: TypeProps) {
    const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)
    const [genSteps, updateGenSteps] = useAtom(atomGenSteps)

    const sortedSubtasks = [...subtasks].sort(
        (a: TypeTasks_SubTask, b: TypeTasks_SubTask) => a.order - b.order
    )

    const hundleGenerate = () => {
        if (genSteps.isGen) {
            // Остановка генерации
            updateGenSteps({ isGen: false, fixed: [] })
            return
        }

        if (0 < genSteps.fixed.length) {
            // Откат после генерации
            onRollbackGenerate(genSteps.fixed)
            updateGenSteps({ isGen: false, fixed: [] })
            return
        }

        console.log('hundleGenerate')

        // Старт генерации
        updateGenSteps({ isGen: true, fixed: [...sortedSubtasks] })
        setTimeout(() => onGenerate("gen_steps"), 3000)
    }

    const handleDragStart = (idx: number, e: React.DragEvent) => {
        e.dataTransfer.effectAllowed = "move"
        e.dataTransfer.setData("text/plain", String(idx))
    }

    const handleDragOver = (idx: number, e: React.DragEvent) => {
        e.preventDefault()
        setDragOverIdx(idx)
    }

    const handleDrop = (idx: number, e: React.DragEvent) => {
        e.preventDefault()
        const draggedIdx = Number(e.dataTransfer.getData("text/plain"))
        if (isNaN(draggedIdx)) return
        const updated = [...sortedSubtasks]
        const [removed] = updated.splice(draggedIdx, 1) // удаление перетаскиваемого элемента
        const targetIdx = draggedIdx < idx ? idx - 1 : idx // корректировка индекса
        updated.splice(targetIdx, 0, removed)
        const withOrder = updated.map((item, i) => ({ ...item, order: i }))
        setDragOverIdx(null)
        onUpdate(withOrder)
    }

    const handleDragEnd = () => setDragOverIdx(null)

    const addNewSubTask = () => {
        const negativeIdCount = subtasks.reduce((acc, subtask) => subtask.id < 0 ? acc + 1 : acc, 0);
        const newsubtask:TypeTasks_SubTask = {
            id: (negativeIdCount + 1) * (-1),
            status: false,
            title: "new subtask",
            description: "",
            continuance: 0,
            instruction: "",
            motivation: "",
            order: subtasks.length
        }
        onUpdate([...subtasks, newsubtask])
    }

    return (
        <div className="editor-task__block">
            {sortedSubtasks.map((item, idx) => (
                <div
                    className={`editor-block-subtask${dragOverIdx === idx ? ' drag-over' : ''}`}
                    key={item.id}
                    onDragOver={e => handleDragOver(idx, e)}
                    onDrop={e => handleDrop(idx, e)}
                    >
                    <div
                        className='editor-block-subtask__drag-and-drop'
                        draggable
                        onDragStart={e => handleDragStart(idx, e)}
                        onDragEnd={handleDragEnd}
                        ><IcoGrid />
                    </div>

                    <CheckBoxTask 
                        state={item.status} 
                        onChangeStatus={() => onUpdate(subtasks.map(subtask =>
                            subtask.id === item.id ? { ...subtask, status: !subtask.status } : subtask
                        ))} />
                    <TextArea 
                        value={item.title}
                        className='editor-block-subtask__title'
                        onChange={e => onUpdate(subtasks.map(subtask =>
                            subtask.id === item.id ? { ...subtask, title: e.target.value } : subtask
                        ))}
                    />
                    <TextArea 
                        value={item.description}
                        label='description'
                        className='editor-block-subtask__text'
                        onChange={e => onUpdate(subtasks.map(subtask =>
                            subtask.id === item.id ? { ...subtask, description: e.target.value } : subtask
                        ))}
                    />
                    <TextArea 
                        value={item.motivation}
                        label='motivation'
                        className='editor-block-subtask__text'
                        onChange={e => onUpdate(subtasks.map(subtask =>
                            subtask.id === item.id ? { ...subtask, motivation: e.target.value } : subtask
                        ))}
                    />
                    <TextArea 
                        value={item.instruction}
                        label='instruction'
                        className='editor-block-subtask__text'
                        onChange={e => onUpdate(subtasks.map(subtask =>
                            subtask.id === item.id ? { ...subtask, instruction: e.target.value } : subtask
                        ))}
                    />
                    
                    <div className='editor-block-subtask__text'>
                        <input 
                            id={`id-`}
                            type="number"
                            className='editor-block-subtask__continuance'
                            value={item.continuance}
                            onChange={e => onUpdate(subtasks.map(subtask =>
                                subtask.id === item.id ? { ...subtask, continuance: Number(e.target.value) } : subtask
                            ))}
                        />
                        <span>hours allotted</span>
                    </div>
                    <Button
                        icon={IcoRemove}
                        variant='remove'
                        onClick={() => onUpdate(subtasks.filter(subtask => subtask.id != item.id))}
                        className="editor-block-subtask__remove"
                        title='remove'
                    />
                </div>
            ))}
            <div
                className={`editor-block-subtask${dragOverIdx === sortedSubtasks.length ? ' drag-over' : ''}`}
                onDragOver={e => handleDragOver(sortedSubtasks.length, e)}
                onDrop={e => handleDrop(sortedSubtasks.length, e)}
                >
                <Button 
                    onClick={hundleGenerate}
                    icon={
                        (genSteps.isGen) ? Loader : 
                        (0 < genSteps.fixed.length) ? IcoBack : IcoMagic
                    }
                />
                <Button
                    icon={IcoAdd}
                    onClick={addNewSubTask}
                    title='add new subtask'
                    text={'new step'}
                />
            </div>
        </div>
    )
}

export default BlockSubTasks