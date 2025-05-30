import React, { useState, useEffect } from 'react'

import Expander from '@comps/Expander/Expander'
import CheckBox from '@comps/CheckBox/CheckBox'

import { TypeSearchPanel, TypeFilterServer, TypeFilterAssocServer_state } from '@mytype/typeSearchAndFilter'
import { stateNames, searchRequest, searchRequestID } from '@utils/jotai.store'
import { useAtom, useAtomValue } from "jotai"

type TypeBlockState = {
    state_dict: TypeFilterAssocServer_state
    type_assoc: string
    title: string
}

function BlockState ({state_dict, type_assoc, title}:TypeBlockState) {

    const [assocRequest, updateAssocRequest] = useAtom<TypeSearchPanel>(searchRequest)
    const assocID = useAtomValue(searchRequestID)
    const [countFilters, setCountFilters] = useState(0)

    useEffect(() => {
        setCountFilters(
            howManyFilters(state_dict, assocID)
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
        {
            Object.entries(state_dict).map(([key, array], index) => (
                <React.Fragment key={`${key}-${index}`}>
                    <div className='filter-panel__states-title'>
                        {stateNames[key as keyof typeof stateNames]} состояние
                    </div>
                    <div className='filter-panel__assoc'>
                        {
                            array.map((elem: TypeFilterServer) => (
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
                </React.Fragment>
            ))
        }
    </Expander>
}


export default BlockState


const howManyFilters = (elems: TypeFilterAssocServer_state, ids:number[]) => {
    let co = 0
    Object.entries(elems).map(([_, array]) => {
        array.forEach(item => {
            if (ids.includes(item.id)){
                co+=1
            }
        })
    })
    return co
}