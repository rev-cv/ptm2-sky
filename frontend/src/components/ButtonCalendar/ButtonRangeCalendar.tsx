import { useState, useRef, useLayoutEffect, MouseEvent } from 'react'
import { Calendar } from 'react-calendar'
import './style.scss'
import { formatDateString } from '@utils/date-funcs'
import IcoCalendar from '@asset/calendar.svg'

import Toggle from '@comps/Toggles/Toggle'

type TypePositionState = {
    top: number
    left: number
}

type TypeProps = {
    noDate?: string
    date?: string
    onClickDay?: (value: string) => void
}

function ButtonRangeCalendar ({ onClickDay, date="", noDate="No Date" }:TypeProps) {

    const [isShowContext, setShowContext] = useState(false)
    const [position, setPosition] = useState<TypePositionState>(
        { top: 0, left: 0 }
    )
    const [days, setDays] = useState(extractDays(date))
    const [isAfter, setStatusAfter] = useState<0|1>(
        date.includes("after") ? 1 : 0
    )

    const buttonRef = useRef<HTMLButtonElement>(null)
    const contextRef = useRef<HTMLDivElement>(null)


    function extractDays(str: string): string {
        const match = str.match(/\b(\d{1,3})\b/)
        if (match) {
            const num = parseInt(match[1], 10)
            if (num >= 0 && num <= 999) {
                return `${num}`
            }
        }
        return ""
    }


    // определение позиции контекстного окна
    const calculatePosition = (): void => {
        if (!buttonRef.current || !contextRef.current) return
        
        const button = buttonRef.current.getBoundingClientRect()
        const context = contextRef.current.getBoundingClientRect()
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        
        // проверка наличия места в различных направлениях
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
    useLayoutEffect(() => {
        if (isShowContext) {
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
    }, [isShowContext])

    const handleButtonClick = (): void => {
        setShowContext(!isShowContext)
    }

    const handleSelectDate = (value: Date | null): void => {
        setShowContext(false)
        if (onClickDay) {
            if (value === null) return onClickDay("")
            console.log(value.toISOString())
            onClickDay(value.toISOString())
        }
    }

    function isValidDateString(str: string): boolean {
        if (typeof str !== "string") return false;
        const date = new Date(str);
        return !isNaN(date.getTime());
    }

    return (
        <div className='context-button-container'>
            <button
                ref={buttonRef}
                onClick={handleButtonClick}
                className="context-button"
            >
                <div className='context-button__value'>
                    {date.includes("days") ? date : date ? formatDateString(date) : noDate}
                </div>
                <div className='context-button__icon'><IcoCalendar /></div>
            </button>
            
            {isShowContext && (
                <div
                    ref={contextRef}
                    className="context-panel"
                    style={{
                        top: `${position.top}px`,
                        left: `${position.left}px`,
                        zIndex: 10
                    }}
                    >
                    <Calendar 
                        onClickDay={handleSelectDate} 
                        value={isValidDateString(date) ? date : ""} />

                    <div className="context-panel__container">

                        <Toggle 
                            elements={[
                                {label: "before", value: 0},
                                {label: "after", value: 1}
                            ]}
                            onChange={value => setStatusAfter(value as 0|1)}
                            activeValue={isAfter}
                        />

                        <input 
                            type="text" 
                            value={days} 
                            maxLength={3}
                            onChange={e => {
                                if (/^\d*$/.test(e.target.value))
                                    setDays(e.target.value)
                            }}/>

                        <span>days</span>

                        <button
                            className="context-panel__close-button"
                            onClick={() => {
                                setShowContext(false)
                                onClickDay && onClickDay(isAfter === 0 ? `before ${days} days` : `after ${days} days`)
                            }}
                        >ok
                        </button>

                    </div>

                    <div className="context-panel__container">
                        <button
                            onClick={() => handleSelectDate(null)}
                            className="context-panel__close-button"
                        >ignore
                        </button>
                    </div>
                    
                        
                </div>
            )}
        </div>
    )
}

export default ButtonRangeCalendar;