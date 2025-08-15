import './style.scss'

import { useState } from 'react'
import { useAtomValue, atomActionList, atomThemeList } from "@utils/jotai.store"
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

    return <Modal 
        visible={visible}
        onRequestClose={() => setVisible(false)}
        onExited={() => {
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