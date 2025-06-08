import { useAtom, openSidePanel } from '@utils/jotai.store'
import './style.scss'

import Button from '@comps/Button/Button'
// import SearchForm from '@comps/SearchForm/SearchForm'
import Search from '@comps/Search/Search'
import Tasks from '@comps/Tasks/Tasks'

import IcoSetting from '@asset/setting.svg'

function CentralArea() {
    const [, setPanel] = useAtom(openSidePanel)

    return (
        <div className="frame-central">

            <div className="frame-central__page">
                <Search />
                <Tasks />
            </div>

            <Button
                className='frame-central__btn-setting'
                onClick={() => setPanel("setting")}
                IconComponent={IcoSetting}
                variant='second'
            />
        </div>
    )
}

export default CentralArea