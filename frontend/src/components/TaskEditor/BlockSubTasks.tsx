import React, { useState } from 'react';
import { TypeTasks_SubTask } from '@mytype/typeTask'

import CheckBoxTask from '@comps/CheckBox/CheckBoxTask'
import TextArea from '@comps/TextArea/TextArea'
import Button from '@comps/Button/Button'

import IcoGrid from '@asset/grid.svg'
import IcoAdd from '@asset/add.svg'
import IcoRemove from '@asset/close.svg'

type TypeProps = {
    subtasks: TypeTasks_SubTask[]
    onUpdate: (newOrder: TypeTasks_SubTask[]) => void
}

function BlockSubTasks({ subtasks, onUpdate }: TypeProps) {
    const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)

    const sortedSubtasks = [...subtasks].sort(
        (a: TypeTasks_SubTask, b: TypeTasks_SubTask) => a.order - b.order
    )

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
        <div className="editor-task__block editor-task__block-subtasks">
            {sortedSubtasks.map((item, idx) => (
                <div
                    className={`editor-subtask${dragOverIdx === idx ? ' drag-over' : ''}`}
                    key={item.id}
                    onDragOver={e => handleDragOver(idx, e)}
                    onDrop={e => handleDrop(idx, e)}
                >
                    <div
                        className='editor-subtask__drag-and-drop'
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
                        className='editor-subtask__title'
                        onChange={e => onUpdate(subtasks.map(subtask =>
                            subtask.id === item.id ? { ...subtask, title: e.target.value } : subtask
                        ))}
                    />
                    <div className='editor-subtask__label'>description</div>
                    <TextArea 
                        value={item.description}
                        className='editor-subtask__text'
                        onChange={e => onUpdate(subtasks.map(subtask =>
                            subtask.id === item.id ? { ...subtask, description: e.target.value } : subtask
                        ))}
                    />
                    <div className='editor-subtask__label'>motivation</div>
                    <TextArea 
                        value={item.motivation}
                        className='editor-subtask__text'
                        onChange={e => onUpdate(subtasks.map(subtask =>
                            subtask.id === item.id ? { ...subtask, motivation: e.target.value } : subtask
                        ))}
                    />
                    <div className='editor-subtask__label'>instruction</div>
                    <TextArea 
                        value={item.instruction}
                        className='editor-subtask__text'
                        onChange={e => onUpdate(subtasks.map(subtask =>
                            subtask.id === item.id ? { ...subtask, instruction: e.target.value } : subtask
                        ))}
                    />
                    <div className='editor-subtask__label'>continuance</div>
                    <div className='editor-subtask__text'>
                        <input 
                            type="number"
                            className='editor-subtask__continuance'
                            value={item.continuance}
                            onChange={e => onUpdate(subtasks.map(subtask =>
                                subtask.id === item.id ? { ...subtask, continuance: Number(e.target.value) } : subtask
                            ))}
                        />
                        <span>hours</span>
                    </div>
                    <Button
                        icon={IcoRemove}
                        variant='remove'
                        onClick={() => onUpdate(subtasks.filter(subtask => subtask.id != item.id))}
                        className="editor-subtask__remove"
                        title='remove'
                    />
                </div>
            ))}
            <div
                className={`editor-subtask${dragOverIdx === sortedSubtasks.length ? ' drag-over' : ''}`}
                onDragOver={e => handleDragOver(sortedSubtasks.length, e)}
                onDrop={e => handleDrop(sortedSubtasks.length, e)}
            >
                <Button
                    icon={IcoAdd}
                    onClick={addNewSubTask}
                    title='add new subtask'
                />
            </div>
        </div>
    )
}

export default BlockSubTasks