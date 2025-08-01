import './style.scss'
import { useState, useEffect } from "react"
import { useAtom, atomIsOpenSidePanel } from '@utils/jotai.store'

function Сurtain() {
    const [currentOpenPanel, setPanel] = useAtom(atomIsOpenSidePanel)
    const [isShow, setStatusShow] = useState(false)

    const [shouldRender, setShouldRender] = useState(currentOpenPanel !== 'none')

    // управление анимацией показа и скрытия компонента
    useEffect(() => {
        if (currentOpenPanel !== 'none') {
            setShouldRender(true)
            // ждем когда компонент отрисуется перед запуском анимации отображения компонента
            setTimeout(() => {
                setStatusShow(true)
            }, 100)
        } else {
            setStatusShow(false)
            // ждем пока компонент закончится анимацию размонтирования, перед реальным скрытием
            const timeout = setTimeout(() => {
                setShouldRender(false)
            }, 300)
            return () => clearTimeout(timeout)
        }
    }, [currentOpenPanel])

    if (!shouldRender) return null

    return <div
        id='curtain'
        className={isShow?"":"hide"}
        onClick={() => setPanel("none")}
        >
    </div>
}

export default Сurtain