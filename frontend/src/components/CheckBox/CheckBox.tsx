// import { useState } from "react"
import './style.scss'

type TypeProps = {
    title?: string
    state?: boolean
    className?: string
    desciption?: string
    onChangeStatus?: (status:boolean) => void
}

function CheckBox({ title = "checkbox", state = false, className = "", desciption, onChangeStatus }: TypeProps) {
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