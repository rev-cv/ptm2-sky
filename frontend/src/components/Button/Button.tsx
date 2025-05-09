import './style.scss'
import {TypeButtonProps} from '@mytype/typeButton'

function Button({ label = "Click me", disabled = false, variant = "icolabel", onClick, children, className }: TypeButtonProps) {
    // const currentOpenPanel = useAtomValue(openSidePanel)

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        if (!disabled && onClick) {
            onClick(event)
        }
    }

    return (
        <button
            className={`${className? className + " " : ""}custom-button custom-button__${variant}`}
            onClick={handleClick}
            disabled={disabled}
            aria-label={label}
            >{children || label}
        </button>
    )
}

export default Button