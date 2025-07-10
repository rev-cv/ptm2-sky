import { atom } from 'jotai'
import { TypeQuery } from '@mytype/typeSaveQueries'

export const atomQueryList = atom<TypeQuery[]>([])

export const queryAllTasks:TypeQuery = {
    id: 0,
    name: "Все задачи",
    q: "",
    infilt: [],
    exfilt: [],
    crange: "",
    arange: "",
    drange: "",
    irange: "",
    donerule: "",
    failrule: "",
    inrisk: [],
    exrisk: [],
    inimpact: [],
    eximpact: [],
    sort: [],
    is_default: false,
    page: 1
}

export const atomQuerySelect = atom<TypeQuery|null>({...queryAllTasks})

