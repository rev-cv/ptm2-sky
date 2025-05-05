import { useAtomValue } from 'jotai'
import { openSidePanel } from '@utils/jotai.store'

function RightPanel() {
    const currentOpenPanel = useAtomValue(openSidePanel)

    return (<>
        <div className={`frame-right${currentOpenPanel !== "right" ? " hide" : ""}`}>RightPanel</div>
    </>)
}

export default RightPanel