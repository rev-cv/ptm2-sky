import { useAtom } from 'jotai'
import { openSidePanel } from '@utils/jotai.store'
import './style.scss'

import Button from '@comps/Button/Button'
import SearchForm from '@comps/SearchForm/SearchForm'

import IcoSetting from '@asset/setting.svg'

function CentralArea() {
    const [, setPanel] = useAtom(openSidePanel)

    return (
        <div className="frame-central">
            {/* <button onClick={() => setPanel("left")}>left</button>
            <button onClick={() => setPanel("right")}>right</button>
            <button onClick={() => setPanel("setting")}>setting</button> */}

            <div className="frame-central__page">
                <SearchForm />
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