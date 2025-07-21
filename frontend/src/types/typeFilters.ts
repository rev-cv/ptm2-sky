import { TypeStates } from '@mytype/typeTask'

export type TypeFilterNew = {
    id: number
    name: string
    desc: string
    type: string
}

export type TypeSchemeStates = {
    physical: TypeFilterNew[]
    intellectual: TypeFilterNew[]
    emotional: TypeFilterNew[]
    motivational: TypeFilterNew[]
    social: TypeFilterNew[]
}

export type TypeFilterNew__Tabs = {
    tabname: string
    sysname: TypeStates | undefined
    descr: string
    allList: TypeFilterNew[] | null | undefined
}