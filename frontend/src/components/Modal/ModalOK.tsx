import './style.scss'
import { useState, useEffect, ReactNode } from 'react'
import Button from '@comps/Button/Button'

type TypeModal = {
    title?: string
    children?: ReactNode
    onStatus?: ((status: boolean) => void)
}

function ModalOK ({title="", onStatus} : TypeModal) {

    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => { setIsOpen(true) }, []) // анимация раскрытия

    const handleStatus = (status:boolean) => {
        // анимация скрытия
        setIsOpen(false)
        setTimeout(() => { if (onStatus) onStatus(status) }, 300)
    }

    return <div className={`modal-curtain${isOpen ? " modal--open" : ""}`}>
        <div 
            className="modal-ok"
            onClick={e => e.stopPropagation()}
            >
            <div className="modal-ok__question">{title}</div>
            <Button 
                text="Ok"
                className='modal-ok__ok'
                onClick={() => handleStatus(true)} 
            />
            <Button 
                text="Cancel"
                className='modal-ok__cancel'
                onClick={() => handleStatus(false)} 
            />
        </div>
    </div>
}

export default ModalOK