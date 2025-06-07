import './style.scss'
import {TypeButtonProps} from '@mytype/typeButton'

function Button({ text=null, IconComponent=null, className, onClick, disabled=false, variant="first" }: TypeButtonProps) {

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        if (!disabled && onClick) {
            onClick(event)
        }
    }

    function getVariantButton() {
        let result = className? className + " " : ""

        if (variant === "first") {
            result += "custom-button-first"
        } else if (variant === "second") {
            result += "custom-button-second"
        } else if (variant === "transparent") {
            result += "custom-button-transparent"
        }

        if (text && IconComponent) {
            result += " custom-button-ico-text"
        } else if (text) {
            result += " custom-button-text"
        } else if (IconComponent) {
            result += " custom-button-ico"
        }

        return result
    }

    return (
        <button
            className={getVariantButton()}
            onClick={handleClick}
            disabled={disabled}
            >
            {IconComponent && <IconComponent />}
            {text && <span>{text}</span>}
        </button>
    )
}

export default Button