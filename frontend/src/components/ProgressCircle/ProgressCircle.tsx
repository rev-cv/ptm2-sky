import './style.scss';

type TypeProgressCircleProps = {
    title?: string;
    from?: number;
    value: number;
    icon?: string | null | React.FunctionComponent<React.SVGProps<SVGSVGElement>> | React.ComponentType<React.SVGProps<SVGSVGElement>>
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

function ProgressCircle ({ value=3, from=3, title="", icon, onClick } : TypeProgressCircleProps) {

    const Icon = icon

    if (value === 0) return null

    const progress = (value / from) * 100 // Процент заполнения: 33.33%, 66.67%, 100%

    return (
        <div className="progress-circle" title={title} onClick={e => {
            if (typeof onClick === 'function') {
                onClick(e);
                e.stopPropagation()
            }}}>
            <div
                className="progress-circle__progress"
                style={{
                    background: `conic-gradient(#3b82f6 ${progress}%, transparent ${progress}% 100%)`,
                }}
                >
                <div className="progress-circle__bg">
                    {
                        Icon && <div className="progress-circle__icon" >
                            <Icon />
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default ProgressCircle