import React, { useRef, useEffect, useLayoutEffect } from "react";

interface TypeProps {
    value?: string;
    label?: string;
    placeholder?: string;
    className?: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onGenerate?: () => void;
    icoGen?: React.FunctionComponent<any> | React.ComponentType<any> | string;
    isBanOnEnter?: boolean;
}

const TextArea: React.FC<TypeProps> = ({
    value,
    label,
    onGenerate,
    icoGen,
    onChange,
    isBanOnEnter = false,
    placeholder = "Введите текст...",
    className = "",
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Функция для автоматического изменения размера
    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        // Сбрасываем высоту к минимуму для правильного пересчета
        textarea.style.height = "auto";

        // Устанавливаем высоту равную scrollHeight
        if (isBanOnEnter) {
            // Если запрещены переносы, фиксируем высоту одной строки
            textarea.style.height = "2.5rem";
        } else {
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    // Обработка изменения текста
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e);
    };

    // Обработка нажатия клавиш
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && isBanOnEnter) {
            e.preventDefault();
            return;
        }
    };

    // Используем useLayoutEffect для синхронного изменения размера
    // это предотвращает видимые скачки интерфейса
    useLayoutEffect(() => {
        adjustHeight();
    }, [value, isBanOnEnter]);

    // Дополнительная корректировка при монтировании
    useEffect(() => {
        adjustHeight();
    }, []);

    return (
        <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`${className}`.trim()}
            // style={{
            //     minHeight: "2.5rem",
            //     transition: "none", // Убираем transition чтобы не было задержек
            // }}
            rows={1}
        />
    );
};

export default TextArea;
