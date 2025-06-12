
import IcoCircle from "@asset/check-sub-circle.svg" 
import IcoCheck from "@asset/check-sub-active.svg" 

type CheckBoxSubTaskProps = {
    state?: boolean
    onChangeStatus?: (status:boolean) => void
}

function CheckBoxTask ({state = false, onChangeStatus}: CheckBoxSubTaskProps) {
    return (
        <button
            className={`checkbox-sub${state ? " active" : ""}`}
            onClick={() => onChangeStatus && onChangeStatus(!state) }
        >
            <div className="circle"><IcoCircle /></div>
            <div className="check"><IcoCheck /></div>
        </button>
    )
}

export default CheckBoxTask