import { useEffect, useState } from 'react'
import { useAtomValue, useSetAtom, isOpenNewTaskEditor, atomQuerySelect, openSidePanel } from '@utils/jotai.store'

import { loadTasks } from '@api/loadTasks2'

import './style.scss'

import QueryEditor from '@comps/QueryEditor/QueryEditor'
import Button from '@comps/Button/Button'

import IcoAdd from '@asset/add.svg'
import IcoSetting from '@asset/setting.svg'
import IcoReload from '@asset/reload.svg'

function QueryPanel () {
    const setPanel = useSetAtom(openSidePanel)
    const setStatusNewTaskEditor = useSetAtom(isOpenNewTaskEditor)
    const querySelect = useAtomValue(atomQuerySelect)
    const [isOpenFilterList, setFilterListStatus] = useState(false)

    useEffect(() => {loadTasks(true)}, [querySelect])

    return <>
    <div className="query-panel">
        <Button 
            icon={IcoAdd}
            onClick={() => setStatusNewTaskEditor(true)}
        />
        <div className="query-panel__query">
            <button
                onClick={() => setFilterListStatus(true)}
                className="query-panel__query-viewer"
                >{querySelect ? querySelect.name : "Request not specified!"}
            </button>
            <Button
                className='query-panel__query-reload'
                onClick={() => loadTasks(true)}
                icon={IcoReload}
                variant='transparent'
            />
        </div>
        <Button
            onClick={() => setPanel("setting")}
            icon={IcoSetting}
            variant='transparent'
        />
    </div>

    { isOpenFilterList &&
        <QueryEditor onExit={() => setFilterListStatus(false)}/>
    }
    </>
}

export default QueryPanel;