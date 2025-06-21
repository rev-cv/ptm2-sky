import './style.scss'
import { useState, useEffect, ReactNode } from 'react'
import Button from '@comps/Button/Button'
import IcoClose from '@asset/close.svg'

type TypeModal = {
    title?: string
    children?: ReactNode
    onClose?: (() => void) | undefined
}

function Modal ({onClose, children}:TypeModal) {

    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => { setIsOpen(true) }, []) // анимация раскрытия

    const handleClose = () => {
        // анимация скрытия
        setIsOpen(false)
        setTimeout(() => { if (onClose) onClose()}, 300)
    }

    return <div 
        className={`modal-curtain${isOpen ? " modal--open" : ""}`}
        onClick={() => handleClose()}
        >
        <div 
            className="modal"
            onClick={e => e.stopPropagation()}
            >
            <Button
                IconComponent={IcoClose}
                variant='transparent'
                onClick={() => handleClose()}
            />
            {children}
        </div>
    </div>
}

export default Modal