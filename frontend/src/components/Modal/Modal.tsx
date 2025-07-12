import './style.scss'
import { useState, useEffect, ReactNode } from 'react'
import Button from '@comps/Button/Button'
import IcoClose from '@asset/close.svg'

type TypeModal = {
    visible: boolean;
    onRequestClose: () => void // запрос на закрытие
    onExited: () => void // сообщить родителю, что анимация завершена
    children?: ReactNode;
    className?: string;
}

function Modal ({visible, onRequestClose, onExited, children, className}:TypeModal) {
    
    const [isClosing, setIsClosing] = useState(false)
    const [isOpening, setIsOpening] = useState(false)

    // анимация открытия
    useEffect(() => { setIsOpening(true) }, [visible])

    // закрытие по ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleClose()
                e.stopPropagation()
            }
        }
        window.addEventListener("keydown", handleEsc)
        return () => window.removeEventListener("keydown", handleEsc)
    })

    // сценарий 1: пользователь инициирует закрытие
    const handleClose = () => {
        setIsClosing(true);
        onRequestClose(); // родитель ставит visible=false
    }

    // сценарий 2: родитель убирает visible
    useEffect(() => {
        if (!visible) {
            setIsClosing(true)
            const timeout = setTimeout(() => {
                setIsClosing(false)
                onExited()
            }, 300)
            return () => clearTimeout(timeout)
        }
    }, [visible]);

    if (!visible && !isClosing) return null;

    return <div 
        className={`modal-curtain${isOpening && !isClosing ? " modal--open" : ""}`}
        onClick={() => handleClose()}
        >
        <div 
            className={`modal${className ? " " + className : ""}`}
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