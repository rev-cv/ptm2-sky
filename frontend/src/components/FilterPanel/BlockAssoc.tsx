import Expander from '@comps/Expander/Expander'
import CheckBox from '@comps/CheckBox/CheckBox'

import { searchRequest, searchRequestID } from '@utils/jotai.store'
import { useAtom, useAtomValue } from "jotai"

import { TypeFilterServer, TypeSearchPanel } from '@mytype/typeSearchAndFilter'
import { useEffect, useState } from 'react'

type TypeBlockActionProps = {
    assoc_list: TypeFilterServer[]
    title: string
    type_assoc: string
}

function BlockActivation ({title, type_assoc, assoc_list}:TypeBlockActionProps) {

    const [assocRequest, updateAssocRequest] = useAtom<TypeSearchPanel>(searchRequest)
    const assocID = useAtomValue(searchRequestID)
    const [countFilters, setCountFilters] = useState(0)

    useEffect(() => {
        setCountFilters(
            howManyFilters(assoc_list, assocID)
        )
    }, [assocRequest])

    const handleChangeStatus = (elem:TypeFilterServer, state:boolean) => {

        if (state) {
            const newAssoc = {
                id: elem.id,
                value: elem.name,
                type: type_assoc,
                type_title: title
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

    return <Expander title={title} className={0 < countFilters ? "activation" : ""}>
        <div className='filter-panel__assoc'>
            {
                assoc_list.map(elem => (
                    <CheckBox 
                        title={elem.name} 
                        key={`rpf-${type_assoc}-f${elem.id}`}
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

export default BlockActivation


const howManyFilters = (elems: TypeFilterServer[], ids:number[]) => {
    let co = 0
    elems.forEach(item => {
        if (ids.includes(item.id)){
            co+=1
        }
    });
    return co
}