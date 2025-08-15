import { atom } from 'jotai'
import { TypeFilterNew } from '@mytype/typeFilters'

export const atomFilterList = atom<TypeFilterNew[]>([])

export const atomThemeList = atom((get) =>
    get(atomFilterList)
        .filter(elem => elem.type === "theme")
        .sort((a, b) => a.name.localeCompare(b.name))
)

export const atomActionList = atom((get) =>
    get(atomFilterList)
        .filter(elem => elem.type === "action_type")
        .sort((a, b) => a.name.localeCompare(b.name))
)