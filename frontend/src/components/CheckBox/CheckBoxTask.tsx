
import IcoCircle from "@asset/check-sub-circle.svg" 
import IcoCheck from "@asset/check-sub-active.svg" 

type CheckBoxSubTaskProps = {
    state?: boolean
}

function CheckBoxTask ({state = false}: CheckBoxSubTaskProps) {
    return (
        <button
            className={`checkbox-sub${state ? " active" : ""}`}
            onClick={() => {
                // Placeholder for future functionality
            }}
        >
            <div className="circle"><IcoCircle /></div>
            <div className="check"><IcoCheck /></div>
        </button>
    )
}

export default CheckBoxTask