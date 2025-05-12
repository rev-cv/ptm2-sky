import { useState, useRef, useEffect, FC, MouseEvent } from 'react';
import './style.scss'

// Определяем интерфейсы для типизации
interface PositionState {
        top: number
        left: number
}

interface ContextButtonProps {
    contextData?: string
    IcoForButton: string
    children?: React.ReactNode | string
}

const ContextButton: FC<ContextButtonProps> = ({ IcoForButton, children }) => {
    const [showContext, setShowContext] = useState<boolean>(false);
    const [position, setPosition] = useState<PositionState>({ top: 0, left: 0   });

    const buttonRef = useRef<HTMLButtonElement>(null);
    const contextRef = useRef<HTMLDivElement>(null);

    // определение позиции контекстного окна
    const calculatePosition = (): void => {
        if (!buttonRef.current || !contextRef.current) return
        
        const button = buttonRef.current.getBoundingClientRect()
        const context = contextRef.current.getBoundingClientRect()
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        
        // Проверяем наличие места в различных направлениях
        const hasSpaceBelow = button.bottom + context.height <= viewport.height
        const hasSpaceLeft = button.left + context.width <= viewport.width
        
        let top: number, left: number
        
        // логика позиционирования .context-panel
        if (hasSpaceBelow && hasSpaceLeft) {
            // под кнопкой, левые стороны совпадают
            top = button.bottom + 5
            left = button.left
        } else if (!hasSpaceBelow && hasSpaceLeft) {
            // над кнопкой, левые стороны совпадают
            top = button.top - context.height - 5
            left = button.left
        } else if (hasSpaceBelow && !hasSpaceLeft) {
            // под кнопкой, правые стороны совпадают
            top = button.bottom + 5
            left = button.right - context.width
        } else {
            // над кнопкой, правые стороны совпадают
            top = button.top - context.height - 5
            left = button.right - context.width
        }

        top += window.scrollY
        left += window.scrollX
        
        setPosition({ top, left })
    };

    // пересчет позиции при изменении видимости
    useEffect(() => {
        if (showContext) {
            calculatePosition()
    
            // отслеживание изменений в DOM
            const observer = new MutationObserver(() => {
                calculatePosition()
            })
            observer.observe(document.body, { childList: true, subtree: true })
    
            // закрытие контекста при событиях во вне
            const handleClickOutside = (event: MouseEvent | Event): void => {
                if (
                    contextRef.current && 
                    buttonRef.current &&
                    event.target instanceof Node &&
                    !contextRef.current.contains(event.target) &&
                    !buttonRef.current.contains(event.target)
                ) {
                    setShowContext(false)
                }
            }
    
            // обработчики событий
            const frameleft = document.querySelector('.frame-left')
            frameleft?.addEventListener('scroll', handleClickOutside as EventListener)
            document.addEventListener('mousedown', handleClickOutside as EventListener)
            window.addEventListener('resize', calculatePosition)
    
            return () => {
                document.removeEventListener('mousedown', handleClickOutside as EventListener)
                frameleft?.removeEventListener('scroll', handleClickOutside as EventListener)
                window.removeEventListener('resize', calculatePosition)
                observer.disconnect()
            }
        }
    }, [showContext])

    const handleButtonClick = (): void => {
        setShowContext(!showContext);
    }

    return (
        <div className='context-button-container'>
            <button
                ref={buttonRef}
                onClick={handleButtonClick}
                className="context-button"
            >
                <IcoForButton />
            </button>
            
            {showContext && (
                <div
                    ref={contextRef}
                    className="context-panel"
                    style={{
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                        zIndex: 10
                    }}
                    >
                    {children}
                </div>
            )}
        </div>
    );
};

export default ContextButton;