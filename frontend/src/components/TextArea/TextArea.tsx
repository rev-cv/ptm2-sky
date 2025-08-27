import "./style.scss";
import { useRef, useLayoutEffect, useEffect, useState, ReactNode } from "react";
import Button from "@comps/Button/Button";

type TypeTextArea = {
    value?: string;
    label?: string;
    placeholder?: string;
    className?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onGenerate?: () => void;
    icoGen?: React.FunctionComponent<any> | React.ComponentType<any> | string;
    isBanOnEnter?: boolean;
    isBlockInput?: boolean;
};

function AutoResizeTextarea({
    value = "",
    label,
    placeholder,
    className,
    onChange,
    onGenerate,
    icoGen,
    isBanOnEnter = false,
    isBlockInput = false,
}: TypeTextArea) {
    const IcoGen = icoGen;
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [isResizing, setIsResizing] = useState(false);

    const resizeHight = () => {
        const textarea = textareaRef.current;
        if (textarea && !isResizing) {
            setIsResizing(true);

            // Сохраняем позицию скролла родительского контейнера
            const parentContainer = findScrollContainer(textarea);
            const scrollTopBefore = parentContainer?.scrollTop || 0;
            const scrollHeightBefore = parentContainer?.scrollHeight || 0;

            // Сохраняем позицию курсора
            const cursorPosition = textarea.selectionStart;

            // Выполняем ресайз
            textarea.style.height = "auto";
            textarea.style.height = textarea.scrollHeight + "px";

            // Восстанавливаем позицию скролла после рефлоу
            requestAnimationFrame(() => {
                if (parentContainer) {
                    // Рассчитываем новую позицию скролла
                    const scrollHeightAfter = parentContainer.scrollHeight;
                    const scrollTopAfter =
                        scrollTopBefore +
                        (scrollHeightAfter - scrollHeightBefore);

                    parentContainer.scrollTop = scrollTopAfter;
                }

                // Восстанавливаем позицию курсора
                textarea.setSelectionRange(cursorPosition, cursorPosition);
                setIsResizing(false);
            });
        }
    };

    // Функция для поиска скроллящегося контейнера
    const findScrollContainer = (
        element: HTMLElement | null,
    ): HTMLElement | null => {
        while (element) {
            const style = window.getComputedStyle(element);
            if (style.overflowY === "scroll" || style.overflowY === "auto") {
                return element;
            }
            element = element.parentElement;
        }
        return null;
    };

    // пересчет высоты при изменении value
    useLayoutEffect(() => {
        if (value) {
            resizeHight();
        }
    }, [value]);

    // пересчет высоты при изменении ширины textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const observer = new ResizeObserver(() => {
            resizeHight();
        });
        observer.observe(textarea);

        return () => observer.disconnect();
    }, []);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        resizeHight();
        if (onChange) onChange(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (isBanOnEnter && e.key === "Enter") {
            e.preventDefault();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        if (isBanOnEnter) {
            e.preventDefault();
            const text = e.clipboardData.getData("text").replace(/\n/g, " ");
            const textarea = textareaRef.current;
            if (textarea) {
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const newValue =
                    value.slice(0, start) + text + value.slice(end);
                if (onChange) {
                    onChange({
                        ...e,
                        target: { ...textarea, value: newValue },
                    } as React.ChangeEvent<HTMLTextAreaElement>);

                    setTimeout(() => {
                        if (textareaRef.current) {
                            const pos = start + text.length;
                            textareaRef.current.setSelectionRange(pos, pos);
                        }
                    }, 0);
                }
            }
        }
    };

    return (
        <div className={`text-area2${className ? " " + className : ""}`}>
            <textarea
                id={generateRandomId()}
                ref={textareaRef}
                className={`text-area2__input`}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
                value={value}
                rows={1}
                placeholder={!placeholder ? " " : placeholder}
                onClick={(e) => e.stopPropagation()}
                disabled={isBlockInput}
            />

            {!label ? null : (
                <label className="text-area2__label">{label}</label>
            )}

            {!onGenerate ? null : (
                <div className="text-area2__gen-btn">
                    <Button icon={IcoGen} onClick={() => onGenerate()} />
                </div>
            )}
        </div>
    );
}

export default AutoResizeTextarea;

const generateRandomId = () => {
    return "id_" + Math.random().toString(36).substr(2, 9);
};
