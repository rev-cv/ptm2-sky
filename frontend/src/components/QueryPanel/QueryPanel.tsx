import { useEffect } from 'react'
import { useAtomValue, useSetAtom, isOpenNewTaskEditor, atomQuerySelect, openSidePanel } from '@utils/jotai.store'

import { loadTasks } from '@api/loadTasks2'

import './style.scss'

import Button from '@comps/Button/Button'

import IcoAdd from '@asset/add.svg'
import IcoSetting from '@asset/setting.svg'
import IcoReload from '@asset/reload.svg'

function QueryPanel () {
    const setPanel = useSetAtom(openSidePanel)
    const setStatusNewTaskEditor = useSetAtom(isOpenNewTaskEditor)
    const querySelect = useAtomValue(atomQuerySelect)

    useEffect(() => {loadTasks(true)}, [querySelect])

    return <div className="query-panel">
        <Button 
            IconComponent={IcoAdd}
            onClick={() => setStatusNewTaskEditor(true)}
        />
        <div className="query-panel__query">
            <button
                onClick={() => {}}
                className="query-panel__query-viewer"
                >{querySelect ? querySelect.name : "Request not specified!"}
            </button>
            {/* <button
                className="query-panel__query-reload"
                onClick={() => {}}
                ><IcoReload/>
            </button> */}
            <Button
                className='query-panel__query-reload'
                onClick={() => loadTasks(true)}
                IconComponent={IcoReload}
                variant='transparent'
            />
        </div>
        
        {/* <Button
            className="query-panel__btn-query"
            // IconComponent={IcoSearch}
            variant="transparent"
            onClick={() => {}}
            text={querySelect ? querySelect.name : "Request not specified!"}
        /> */}

        <Button
            // className='frame-central__btn-setting'
            onClick={() => setPanel("setting")}
            IconComponent={IcoSetting}
            variant='transparent'
        />
    </div>
}

export default QueryPanel;