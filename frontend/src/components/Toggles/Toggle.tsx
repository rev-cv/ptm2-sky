import './style.scss'

export type TypeToggleElement = {
    label: string
    value: number
    isActive: boolean
    description?: string
}

export type TypeToggle = {
    elements: TypeToggleElement[]
    onChange: (value: number) => void
    activeValue: number
}

function Toggle({elements, onChange, activeValue=0}:TypeToggle) {
    return (
        <div className="toggle" role="radiogroup" aria-label="Theme switcher">
            {
                setActiveByValue(elements, activeValue).map((elem, index) => 
                    <div
                        className={`toggle__option${elem.isActive ? ' active' : ''}`}
                        onClick={() => onChange(elem.value)}
                        key={`standart-toggle-${index}`}
                        ><span>{elem.label}</span>
                    </div>
                )
            }
        </div>
    );
}

export default Toggle;

export function setActiveByValue(array: TypeToggleElement[], targetValue: number): TypeToggleElement[] {
    return array.map(obj => ({...obj, isActive: obj.value === targetValue }))
}