import './style.scss'

import { useState, useEffect } from 'react'
import { useAtomValue, atomActionList, atomThemeList, atomGenTaskBuffer, getDefaultStore } from "@utils/jotai.store"
import { TypeViewTask } from '@mytype/typeTask'
import { PagesForTaskEditor as Page } from '@mytype/typeTask'

import Modal from '@comps/Modal/Modal'
import BlockMenu, { asideButtons } from './BlockMenu'
import PageSelector from './PageSelector'


type TypeProps = {
    originakTask: TypeViewTask
    onExit?: (editedTask:TypeViewTask) => void
    onDelete?: () => void
}

function TaskEditor ({originakTask, onExit, onDelete}:TypeProps) {
    const [visible, setVisible] = useState(true)
    const [activeTab, setActiveTab] = useState(asideButtons[0][1])
    const [task, updateTask] = useState({...originakTask})

    const themeList = useAtomValue(atomThemeList)
    const actionList = useAtomValue(atomActionList)

    useEffect(() => {
        // проверка буфера генераций на предмет готовых генераций
        const store = getDefaultStore()
        const buffer = store.get(atomGenTaskBuffer)
        const bufferElement = buffer[task.id] ?? {}
        const fields = Object.keys(bufferElement)

        if (fields.length === 0) return

        const updatedTask = { ...task }
        const taskFields = Object.keys(updatedTask)

        fields.forEach(key => {
            if (taskFields.includes(key)) {
                // @ts-ignore
                updatedTask[key] = bufferElement[key]
            }
        })

        updateTask(updatedTask)
        store.set(atomGenTaskBuffer, prev => {
            const newPrev = Object.fromEntries(
                Object.entries(prev).filter(([key]) => key !== String(task.id))
            )
            return newPrev
        })
    }, [])

    return <Modal 
        visible={visible}
        onRequestClose={() => setVisible(false)}
        onExited={() => {
            // при закрытии инициировать очистку буфера
            const store = getDefaultStore()
            store.set(atomGenTaskBuffer, prev => {
                const newPrev = Object.fromEntries(
                    Object.entries(prev).filter(([key]) => key !== String(task.id))
                )
                return newPrev
            })
            if (onExit) onExit(task)
        }}>
    
        <div className="editor-task">
            <BlockMenu
                isEdit={true}
                activeTab={activeTab}
                onChangeTab={activeTab => setActiveTab(activeTab)}
                onDeleteTask={() => onDelete && onDelete()}
            />

            <div className="editor-task__content">
                <PageSelector
                    task={task}
                    updateTask={updateTask}
                    activeTab={activeTab}
                    allFilters={
                        Page.THEME === activeTab ? themeList :
                        Page.ACTION === activeTab ? actionList 
                        : undefined
                    }
                />
            </div>
        </div>

    </Modal>
}

export default TaskEditor