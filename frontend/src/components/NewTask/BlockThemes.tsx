import { useAtomValue, currentNewTask } from '@utils/jotai.store'

import Expander from '@comps/Expander/Expander'

function BlockThemes() {
    const fillingNewTask = useAtomValue(currentNewTask)

    // if (!fillingNewTask.match_themes?.length && !fillingNewTask.new_themes?.length) {
    //     return null
    // }

    return <Expander 
        title='Темы' 
        onEditData={() => console.log("Темы")}>
        {
            fillingNewTask.match_themes?.length ? 
                fillingNewTask.match_themes?.map((elem, index) => 
                    <ThemeElement {...elem} key={`task-new--theme-${index}`} /> 
                )
            : null
        }
        {
            fillingNewTask.new_themes?.length ? 
                <>
                    <div className='new-task__theme-elem-add-new'>новые темы</div>
                    {
                        fillingNewTask.new_themes?.map((elem, index) => 
                            <ThemeElement {...elem} key={`task-new--new-theme-${index}`} /> 
                        )
                    }
                </>
            : null
        }

        {
            (!fillingNewTask.match_themes?.length && !fillingNewTask.new_themes?.length) &&
                <div className='new-task__no-data'>no data</div>
        }

    </Expander>
}

export default BlockThemes


// --- елемент темы ---

import IcoThemeElement from '@asset/theme-element.svg'
import { TypeThemes } from '@mytype/typesNewTask'

function ThemeElement ({name="", description, match_percentage=0, reason=""}: TypeThemes) {

    return (
        <div className="new-task__theme-elem">
            <div className='new-task__theme-elem-title'>
                <IcoThemeElement />
                {name}
                <span>{`(${match_percentage}% match)`}</span>
            </div>
            <div className='new-task__subtask-descr'>{description}</div>
            <div className='new-task__subtask-motiv'>{reason}</div>
        </div>
    )
}