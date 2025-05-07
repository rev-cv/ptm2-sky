import './style.scss'

interface ButtonProps {
    label?: string
    disabled?: boolean
    variant?: 'icolabel' | 'ico' | 'label' | 'icolabel-s' | 'ico-s' | 'label-s'
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    children?: React.ReactNode
    className?: string
}

function Button({ label = "Click me", disabled = false, variant = "icolabel", onClick, children, className }: ButtonProps) {
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