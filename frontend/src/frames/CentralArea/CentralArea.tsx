import { useAtom } from 'jotai'
import { openSidePanel } from '@utils/jotai.store'

function CentralArea() {
    const [, setPanel] = useAtom(openSidePanel)

    return (
        <div className="frame-central">
            <button onClick={() => setPanel("left")}>left</button>
            <button onClick={() => setPanel("right")}>right</button>
            <button onClick={() => setPanel("setting")}>setting</button>
        </div>
    )
}

export default CentralArea