import { TypeFilterNew } from '@mytype/typeFilters'
import { TypeQuery } from '@mytype/typeSaveQueries'

import { createFilter } from '@api/createFilter'
import { updateFilter } from '@api/updateFilter'
import { removeFilter } from '@api/removeFilter'

import TextArea from '@comps/TextArea/TextArea'
import Button from '@comps/Button/Button'

import IcoDelete from '@asset/delete.svg'
import IcoUpdate from '@asset/save.svg'

type TypeProps = {
    title: string
    editable: TypeFilterNew
    updateEditable: (query: TypeFilterNew) => void
    setEditableQuery: (value:TypeQuery|TypeFilterNew|null) => void
}

function BlockThemeEditor ({title, editable, updateEditable, setEditableQuery}:TypeProps) {

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

        <div className='query-block-editor__bottom'>
            {editable.id < 0 ?
                <Button 
                    text="create"
                    icon={IcoUpdate}
                    onClick={() => {
                        createFilter(editable)
                        setEditableQuery(null)
                    }}
                /> : <>
                    <Button 
                        text="delete"
                        icon={IcoDelete}
                        variant='remove'
                        onClick={() => {
                            removeFilter(editable.id)
                            setEditableQuery(null)
                        }}
                    />
                    <Button 
                        text="update"
                        icon={IcoUpdate}
                        onClick={() => {
                            updateFilter(editable)
                        }}
                    />
                </>
            }
        </div>
    </div>
}

export default BlockThemeEditor