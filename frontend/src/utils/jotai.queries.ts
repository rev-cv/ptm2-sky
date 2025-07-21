import { atom } from 'jotai'
import { TypeQuery } from '@mytype/typeSaveQueries'

export const atomQueryList = atom<TypeQuery[]>([])

export const queryAllTasks:TypeQuery = {
    id: -1,
    name: "Все задачи",
    descr: "This is a default query that retrieves all tasks.",
    q: "",
    infilt: [],
    exfilt: [],
    crange: ["",""],
    arange: ["",""],
    drange: ["",""],
    irange: ["",""],
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

type TypeSamplingStatus = 'idle' | 'loading' | 'success' | 'error'

export const samplingStatus = atom<TypeSamplingStatus>("idle")