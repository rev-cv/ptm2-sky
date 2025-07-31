import './style.scss'

import { useAtomValue, openSidePanel } from '@utils/jotai.store'
// import NewTask from '@comps/NewTask/NewTask'

import QueryPanel from '@comps/QueryPanel/QueryPanel'
import Tasks from '@comps/Tasks/Tasks'
import ThemeToggle from '@comps/Toggles/ThemeToggle'
import Сurtain from '@comps/Сurtain/Сurtain'
import Toast from '@comps/Toast/Toast'

import EditorNewTask from '@comps/TaskEditor/EditorNewTask'
import { useEffect } from 'react'

import { loadFilters } from '@api/loadFilters'
import { loadQueries } from '@api/loadQueries'

function PageApp() {
    const currentOpenPanel = useAtomValue(openSidePanel)

    useEffect(() => {
        // window.addEventListener('load', () => {
        //     loadFilters()
        //     loadQueries()
        // })
        // после добавления ProtectedRoute window.addEventListener потерял смысл
        loadFilters()
        loadQueries()
    }, [])

    return (
        <>
            {/* выдвижная боковая панель (левая) с новой задачей */}
            {/* <div 
                className={`frame-left${currentOpenPanel !== "left" ? " hide" : ""} new-task`}>
                <div className="frame-left__h3">New Task</div>

                <NewTask />  
            </div> */}

            {/* центральная область */}
            <div className="frame-central">
                <div className="frame-central__page">
                    <QueryPanel />
                    <Tasks />
                </div>
            </div>

            {/* выдвижная боковая панель (правая) с настройками */}
            <div className={`frame-setting${currentOpenPanel !== "setting" ? " hide" : ""}`}>
                <div className="frame-setting__h2">Setting</div>
                <div className="frame-setting__h3">Theme</div>
                <ThemeToggle />
            </div>

            <Сurtain />

            <EditorNewTask />

            <Toast />
        </>
    )
}

export default PageApp
