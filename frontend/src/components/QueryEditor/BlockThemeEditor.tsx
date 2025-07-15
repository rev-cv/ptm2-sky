import { TypeFilterNew } from '@mytype/typeFilters'

import TextArea from '@comps/TextArea/TextArea'

type TypeProps = {
    title: string
    editable: TypeFilterNew
    updateEditable: (query: TypeFilterNew) => void
}

function BlockThemeEditor ({title, editable, updateEditable}:TypeProps) {

    return <div className='query-block-editor__block'>
        <div className='query-block-editor__title'>{title}</div>
        <TextArea 
            value={editable.name}
            placeholder="Task title"
            className='query-block-editor__name'
            onChange={e => updateEditable({...editable, name: e.target.value})}
            isBanOnEnter={true}
        />
        <TextArea 
            value={editable.desc}
            placeholder="Description"
            className='query-block-editor__descr'
            onChange={e => updateEditable({...editable, desc: e.target.value})}
            isBanOnEnter={false}
        />
    </div>
}

export default BlockThemeEditor