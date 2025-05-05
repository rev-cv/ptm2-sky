import { useAtomValue } from 'jotai'
import { openSidePanel } from '@utils/jotai.store'

function LeftPanel() {
    const currentOpenPanel = useAtomValue(openSidePanel)

    return (<>
        <div className={`frame-left${currentOpenPanel !== "left" ? " hide" : ""}`}>LeftPanel</div>
    </>)
}

export default LeftPanel