// import { useState } from "react"
import './style.scss'

type TypeCheckBox = {
    title?: string
    state?: boolean
    // children?: ReactNode
    className?: string
    desciption?: string
    onChangeStatus?: (status:boolean) => void
}

function CheckBox({ title = "checkbox", state = false, className = "", desciption, onChangeStatus }: TypeCheckBox) {
    return (
        <button
            className={`${className ? className + " " : ""}checkbox${state ? " active" : ""}`}
            onClick={() => {
                if (onChangeStatus) onChangeStatus(!state)
            }}
            title={desciption ? desciption : ""}
        >
            {title}
        </button>
    )
}

export default CheckBox