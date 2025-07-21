import { atom } from 'jotai'
import { TypeFilterNew, TypeSchemeStates } from '@mytype/typeFilters'

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

export const atomStressList = atom((get) =>
    get(atomFilterList)
        .filter(elem => elem.type === "stress")
        .sort((a, b) => a.name.localeCompare(b.name))
)

export const atomStateList = atom((get) =>
    get(atomFilterList)
        .filter(elem => elem.type.slice(0,5) === "state")
        .sort((a, b) => a.name.localeCompare(b.name))
)

const schemeStates:TypeSchemeStates = {
    physical: [],
    intellectual: [],
    emotional: [],
    motivational: [],
    social: [],
}

const stateKeys = Object.keys(schemeStates)

export const atomStateDict = atom((get) => {
    const all = get(atomFilterList).filter(elem => elem.type.slice(0,5) === "state")

    const result = stateKeys.reduce((acc, k) => {
        (acc as any)[k] = []
        return acc
    }, {} as TypeSchemeStates)

    for (let index = 0; index < all.length; index++) {
        const elem:TypeFilterNew = all[index]
        const type = elem.type.slice(7)
        if (stateKeys.includes(type)){
            result[type as keyof typeof result].push(elem)
        }
    }
    return result
})

export const stateNames = {
    "physical": "физическое",
    "intellectual": "интеллектуальное",
    "emotional": "эмоциональное",
    "motivational": "мотивационное",
    "social": "социальное",
}