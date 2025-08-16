import { atom } from 'jotai'
import { TypeQuery } from '@mytype/typeQueries'

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
    frange: ["",""],
    donerule: "",
    failrule: "",
    statusrule: [],
    inrisk: [],
    exrisk: [],
    inimpact: [],
    eximpact: [],
    order_by: [],
    is_default: false,
    page: 0
}

export const atomQuerySelect = atom<TypeQuery|null>({...queryAllTasks})

type TypeSamplingStatus = 'idle' | 'loading' | 'success' | 'error'

export const atomSamplingStatus = atom<TypeSamplingStatus>("loading")

export const atomQueryCurrentTab = atom<number>(0)