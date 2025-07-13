import { useRef, useLayoutEffect, useState, useEffect } from "react";
import './style.scss'

type TypeTextArea = {
    value?: string
    placeholder?: string
    className?: string
    onChange?: (e:React.ChangeEvent<HTMLTextAreaElement>) => void
    isBanOnEnter?: boolean
}

function AutoResizeTextarea({value="", className, placeholder, onChange, isBanOnEnter=false}:TypeTextArea) {

    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [empty, setEmpty] = useState(false)

    const resizeHight = () => {
        const textarea = textareaRef.current
        if (textarea) {
            textarea.style.height = "auto"
            textarea.style.height = textarea.scrollHeight + "px"
        }
    }

    // пересчет высоты при изменении value
    useLayoutEffect(() => resizeHight(), [value])

    // пересчет высоты при изменении ширины textarea
    useEffect(() => {
        const textarea = textareaRef.current
        if (!textarea) return
        const observer = new ResizeObserver(() => {
            resizeHight()
        })
        observer.observe(textarea)
        return () => observer.disconnect()
    }, [])

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        resizeHight()
        setEmpty(textareaRef.current?.value.trim() === '')
        if (onChange) onChange(e)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (isBanOnEnter && e.key === "Enter") {
            e.preventDefault()
        }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        if (isBanOnEnter) {
            e.preventDefault()
            const text = e.clipboardData.getData('text').replace(/\n/g, ' ')
            const textarea = textareaRef.current
            if (textarea) {
                const start = textarea.selectionStart
                const end = textarea.selectionEnd
                const newValue = value.slice(0, start) + text + value.slice(end)
                if (onChange) {
                    onChange({
                        ...e,
                        target: { ...textarea, value: newValue }
                    } as React.ChangeEvent<HTMLTextAreaElement>)
                    // установка курсора после вставленного текста
                    setTimeout(() => {
                        if (textareaRef.current) {
                            const pos = start + text.length
                            textareaRef.current.setSelectionRange(pos, pos)
                        }
                    }, 0)
                }
            }
        }
    }

    return (
        <textarea
            ref={textareaRef}
            className={`text-area${className?" "+className:""}${empty?" empty":""}`}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            value={value}
            placeholder={placeholder}
            rows={1}
        />
    )
}

export default AutoResizeTextarea