import React, { useState } from 'react';
import { TypeTasks_SubTask } from '@mytype/typeTask'
import CheckBoxTask from '@comps/CheckBox/CheckBoxTask'
import IcoGrid from '@asset/grid.svg'

type TypeBlockSubTasks = {
    subtasks: TypeTasks_SubTask[]
    onUpdate: (newOrder: TypeTasks_SubTask[]) => void
}

function compare(a: TypeTasks_SubTask, b: TypeTasks_SubTask) {
    return a.order - b.order
}

function BlockSubTasks({ subtasks, onUpdate }: TypeBlockSubTasks) {
    const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)

    const sortedSubtasks = [...subtasks].sort(compare)

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
        const [removed] = updated.splice(draggedIdx, 1)
        updated.splice(idx, 0, removed)
        
        const withOrder = updated.map((item, i) => ({ ...item, order: i }))
        setDragOverIdx(null)
        onUpdate(withOrder)
    }

    const handleStatus = (id: number) => {
        const updated = subtasks.map(subtask =>
            subtask.id === id ? { ...subtask, status: !subtask.status } : subtask
        )
        onUpdate(updated)
    };

    const handleDragEnd = () => setDragOverIdx(null)

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
                    <CheckBoxTask state={item.status} onChangeStatus={() => handleStatus(item.id)} />
                    <div className='editor-subtask__title'>{item.title}</div>
                </div>
            ))}
            <div
                className={`editor-subtask${dragOverIdx === sortedSubtasks.length ? ' drag-over' : ''}`}
                onDragOver={e => handleDragOver(sortedSubtasks.length, e)}
                onDrop={e => handleDrop(sortedSubtasks.length, e)}
                style={{ flexGrow: 1 }}
            ></div>
        </div>
    )
}

export default BlockSubTasks