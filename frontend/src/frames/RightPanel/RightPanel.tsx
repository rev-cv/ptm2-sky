import { useAtomValue } from 'jotai'
import { openSidePanel } from '@utils/jotai.store'

import FilterPanel from '@comps/FilterPanel/FilterPanel'

import './style.scss'

function RightPanel() {
    const currentOpenPanel = useAtomValue(openSidePanel)

    return <div 
        className={
            `frame-right${currentOpenPanel !== "right" ? " hide" : ""}`
        }>
            <div className="frame-right__h3">Filters</div>
            <FilterPanel />
    </div>
}

export default RightPanel