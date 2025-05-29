import { useState, ReactNode } from 'react'
import IcoPoint from '@asset/point.svg'
import IcoEdit from '@asset/edit.svg'
import './style.scss'

type TypeExpander = {
    title?: string
    children?: ReactNode
    className?: string
    onExpand?: () => void
    onEditData?: () => void
    IcoEditData?: string
}

function Expander ({
    title= "Expander", 
    children = <div>expander</div>, 
    IcoEditData = IcoEdit,
    className,
    onExpand,
    onEditData
}:TypeExpander) {

    const [isExpanded, setIsExpanded] = useState(false)

    return <div className={`expander${isExpanded ? " view" : ""}${className ? " " + className : ""}`}>
        <div 
            className="expander__header"
            onClick={() => {
                setIsExpanded(!isExpanded)
                if (onExpand) onExpand()
            }}
            >
            <div className="expander__pointer"><IcoPoint /></div>
            <span>{title}</span>

            {
                onEditData && 
                    <button
                        className="expander__btn-data-edit"
                        onClick={(e) => {
                            e.stopPropagation()
                            onEditData()
                        }}  
                        ><IcoEditData />
                    </button>
            }            
        </div>

        <div className="expander__options">
            <div className="expander__options-sub">
                {children}    
            </div>
        </div>
    </div>
}

export default Expander