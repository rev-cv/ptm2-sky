import './style.scss'

import { useAtom, openSidePanel } from '@utils/jotai.store'
import NewTask from '@comps/NewTask/NewTask'

import Button from '@comps/Button/Button'
import Search from '@comps/Search/Search'
import QueryPanel from '@comps/QueryPanel/QueryPanel'
import Tasks from '@comps/Tasks/Tasks'
import FilterPanel from '@comps/FilterPanel/FilterPanel'
import ThemeToggle from '@comps/Toggles/ThemeToggle'
import Сurtain from '@comps/Сurtain/Сurtain'
import Toast from '@comps/Toast/Toast'

import EditorNewTask from '@comps/EditorTask/EditorNewTask'

import IcoSetting from '@asset/setting.svg'

function PageApp() {
    const [currentOpenPanel, setPanel] = useAtom(openSidePanel)

    return (
        <>
            {/* выдвижная боковая панель (левая) с новой задачей */}
            <div 
                className={`frame-left${currentOpenPanel !== "left" ? " hide" : ""} new-task`}>
                <div className="frame-left__h3">New Task</div>

                <NewTask />  
            </div>

            {/* центральная область */}
            <div className="frame-central">
                <div className="frame-central__page">
                    {/* <Search /> */}
                    <QueryPanel />
                    <Tasks />
                </div>
                {/* <Button
                    className='frame-central__btn-setting'
                    onClick={() => setPanel("setting")}
                    IconComponent={IcoSetting}
                    variant='second'
                /> */}
            </div>

            {/* выдвижная боковая панель (правая) с фильтрами */}
            <div 
                className={
                    `frame-right${currentOpenPanel !== "right" ? " hide" : ""}`
                }>
                    <div className="frame-right__h3">Filters</div>
                    <FilterPanel />
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
