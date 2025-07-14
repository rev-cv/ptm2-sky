import './style.scss'

type TypeProps = {
    title?: string
    state?: boolean
    icon?: string
    className?: string
    desciption?: string
    onChangeStatus?: (status:boolean) => void
}

function CheckBox({ title = "checkbox", state = false, icon, className = "", desciption, onChangeStatus }: TypeProps) {

    const Icon = icon ? icon : null

    return (
        <button
            className={`${className ? className + " " : ""}checkbox${state ? " active" : ""}`}
            onClick={() => { if (onChangeStatus) onChangeStatus(!state) }}
            title={desciption ? desciption : ""}
            >{Icon ? <Icon/> : title}
        </button>
    )
}

export default CheckBox