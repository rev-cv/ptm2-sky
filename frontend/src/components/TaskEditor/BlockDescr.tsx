import TextArea from '@comps/TextArea/TextArea'
import Toggle from '@comps/Toggles/Toggle'

type TypeDescrTask = {
    title?: string
    descr?: string
    motiv?: string
    status?: boolean
    id: number
    created?: string
    finished?: string
    onChangeTitle: (title:string) => void
    onChangeDescr: (descr:string) => void
    onChangeMotiv: (descr:string) => void
    onChangeStatus: (status:boolean) => void
}

function DescriptionTask ({title="", descr="", motiv="", status, id, created="N/A", finished, onChangeTitle, onChangeDescr, onChangeMotiv, onChangeStatus}:TypeDescrTask) {

    return <div className="editor-task__block editor-task__block-descr">

        { 0 < id ?
            <div className='editor-task__block-descr__status'>
                <Toggle
                    elements={[
                        { label: "wait", value: 0, isActive: true },
                        { label: "done", value: 1, isActive: false }
                    ]}
                    activeValue={status ? 1 : 0}
                    onChange={status => onChangeStatus(0 < status)}
                />
            </div> : null
        }

        <div className='editor-task__block-descr__id'>
            {id < 0 ? `Сreating a new task…` : `${id}: created ${created} ${finished ? "- finished " + finished : ""}`}
        </div>

        <TextArea 
            value={title}
            placeholder="Task title"
            className='editor-task__block-descr__title'
            onChange={e => onChangeTitle(e.target.value)}
            isBanOnEnter={true}
        />

        <div className='editor-task__block__label'>description</div>
        <TextArea 
            value={descr} 
            className='editor-task__block-descr__descr'
            onChange={e => onChangeDescr(e.currentTarget.value)}
        />

        <div className='editor-task__block__label'>motivation</div>
        <TextArea 
            value={motiv} 
            className='editor-task__block-descr__descr'
            onChange={e => onChangeMotiv(e.currentTarget.value)}
        />
    </div>
}

export default DescriptionTask