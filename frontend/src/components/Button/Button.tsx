import "./style.scss";

type TypeProps = {
    text?: string | null;
    title?: string;
    icon?: string | null | React.FunctionComponent | React.ComponentType;
    className?: string | null;
    variant?: "first" | "second" | "transparent" | "remove";
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    disabled?: boolean;
};

function Button({
    text = null,
    title = "",
    icon = null,
    className,
    onClick,
    disabled = false,
    variant = "first",
}: TypeProps) {
    const Icon = icon;

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
        if (!disabled && onClick) {
            onClick(event);
        }
    };

    function getVariantButton() {
        let result = className ? className + " " : "";

        if (variant === "first") {
            result += "custom-button-first";
        } else if (variant === "second") {
            result += "custom-button-second";
        } else if (variant === "transparent") {
            result += "custom-button-transparent";
        } else if (variant === "remove") {
            result += "custom-button-remove";
        }

        if (text && Icon) {
            result += " custom-button-ico-text";
        } else if (text) {
            result += " custom-button-text";
        } else if (Icon) {
            result += " custom-button-ico";
        }

        return result;
    }

    return (
        <button
            className={getVariantButton()}
            onClick={handleClick}
            disabled={disabled}
            title={title}
        >
            {Icon && <Icon />}
            {text && <span>{text}</span>}
        </button>
    );
}

export default Button;
