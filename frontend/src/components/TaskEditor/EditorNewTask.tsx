import './style.scss'
import { useState } from 'react'
import { currentNewTask2, isOpenNewTaskEditor, openedTabsTaskEditor, atomThemeList, atomActionList, resetTask2, useAtom, useAtomValue } from '@utils/jotai.store'
import { PagesForTaskEditor as Page } from '@mytype/typeTask'

import { createTask } from '@api/createTask'

import Button from '@comps/Button/Button'
import Modal from '@comps/Modal/Modal'
import BlockMenu from './BlockMenu'
import PageSelector from './PageSelector'

import IcoAdd from '@asset/add.svg'
import IcoClean from '@asset/clean.svg'

function EditorNewTask () {
    const [visible, setVisible] = useState(true)
    const [isOpen, setStatus] = useAtom(isOpenNewTaskEditor)
    const [activeTab, setActiveTab] = useAtom(openedTabsTaskEditor)
    const [task, updateTask] = useAtom(currentNewTask2)

    const themeList = useAtomValue(atomThemeList)
    const actionList = useAtomValue(atomActionList)

    if (!isOpen) return

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

            <div className='editor-task__bottom-btns'>    
                <Button
                    text="Create task"
                    icon={IcoAdd}
                    onClick={() => {
                        createTask()
                        setStatus(false)
                        setActiveTab(0)
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