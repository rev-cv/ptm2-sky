import Expander from '@comps/Expander/Expander'
import CheckBox from '@comps/CheckBox/CheckBox'

import { searchRequest, searchRequestID } from '@utils/jotai.store'
import { useAtom, useAtomValue } from "jotai"

import { TypeFilterServer, TypeSearchPanel } from '@mytype/typeSearchAndFilter'

type TypeBlockThemesProps = {
    theme_list: TypeFilterServer[]
}

function BlockThemes ({theme_list}:TypeBlockThemesProps) {

    const [assocRequest, updateAssocRequest] = useAtom<TypeSearchPanel>(searchRequest)
    const assocID = useAtomValue(searchRequestID)

    const handleChangeStatus = (elem:TypeFilterServer, state:boolean) => {

        if (state) {
            const newAssoc = {
                id: elem.id,
                value: elem.name,
                type: "theme"
            }
            updateAssocRequest({
                ...assocRequest,
                filters: [...assocRequest.filters, newAssoc]
            })
        } else {
            updateAssocRequest({
                ...assocRequest,
                filters: assocRequest.filters.filter(e => (e.id != elem.id))
            })
        }

    }

    return <Expander title='Темы'>
        <div className='filter-panel__assoc'>
            {
                theme_list.map(elem => (
                    <CheckBox 
                        title={elem.name} 
                        key={`rpf-f${elem.id}`}
                        onChangeStatus={state => {
                            handleChangeStatus(elem, state)
                        }}
                        state={assocID.includes(elem.id)}
                        desciption={elem.description}
                    />
                ))
            }
        </div>        
    </Expander>
}

export default BlockThemes