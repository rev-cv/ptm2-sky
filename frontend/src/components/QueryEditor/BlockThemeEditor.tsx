import { TypeFilterServer } from '@mytype/typeSearchAndFilter'

import TextArea from '@comps/TextArea/TextArea'

type TypeProps = {
    title: string
    editable: TypeFilterServer
    updateEditable: (query: TypeFilterServer) => void
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
            value={editable.description}
            placeholder="Description"
            className='query-block-editor__descr'
            onChange={e => updateEditable({...editable, description: e.target.value})}
            isBanOnEnter={false}
        />
    </div>
}

export default BlockThemeEditor