import "./style.scss";
import { useEffect } from "react";
import {
    useAtomValue,
    atomIsOpenSidePanel,
    atomIsOpenEditorUser,
} from "@utils/jotai.store";

import User from "@comps/User/User";
import QueryPanel from "@comps/QueryPanel/QueryPanel";
import Tasks from "@comps/Tasks/Tasks";
import Сurtain from "@comps/Сurtain/Сurtain";
import Toast from "@comps/Toast/Toast";
import EditorNewTask from "@comps/TaskEditor/EditorNewTask";
import UserEditor from "@comps/UserEditor/UserEditor";

import { loadFilters } from "@api/loadFilters";
import { loadQueries } from "@api/loadQueries";

function PageApp() {
    const currentOpenPanel = useAtomValue(atomIsOpenSidePanel);
    const isOpenEditorUser = useAtomValue(atomIsOpenEditorUser);

    useEffect(() => {
        loadQueries();
        loadFilters();
    }, []);

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
            <div
                className={`frame-setting${currentOpenPanel !== "setting" ? " hide" : ""}`}
            >
                <User />
            </div>

            <Сurtain />

            <EditorNewTask />

            {isOpenEditorUser && <UserEditor />}

            <Toast />
        </>
    );
}

export default PageApp;
