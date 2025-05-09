import './style.scss'
import { TypeThemes } from '@mytype/typesNewTask'
import IcoThemeElement from '@asset/theme-element.svg'

function ThemeElement ({name="", description, match_percentage=0, reason=""}: TypeThemes) {

    return (
        <div className="new-task__theme-elem">
            <div className='new-task__theme-elem-title'>
                <IcoThemeElement />
                {name}
                <span>{`(${match_percentage}% match)`}</span>
            </div>
            <div className='new-task__subtask-motiv'>{description}</div>
            <div className='new-task__subtask-descr'>{reason}</div>
        </div>
        
    )
}

export default ThemeElement