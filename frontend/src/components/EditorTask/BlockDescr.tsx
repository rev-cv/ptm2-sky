import TextArea from '@comps/TextArea/TextArea'

type TypeDescrTask = {
    title?: string
    descr?: string
    motiv?: string
    id?: number | string
    created?: string
    onChangeTitle: (title:string) => void
    onChangeDescr: (descr:string) => void
    onChangeMotiv: (descr:string) => void
}

function DescriptionTask ({title="", descr="", motiv="", id="", created="N/A", onChangeTitle, onChangeDescr, onChangeMotiv}:TypeDescrTask) {

    return <div className="editor-task__block editor-task__block-descr">
        <div className='editor-task__block-descr__id'>
            {`${id}: created ${created}`}
        </div>
        <TextArea 
            value={title}
            placeholder="title"
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