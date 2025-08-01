import './style.scss'
import Loader from '@comps/Loader/Loader'

function SuspensePage () {
    return <div className={`suspense-page`}>
        <span><Loader /></span>
    </div>
}

export default SuspensePage