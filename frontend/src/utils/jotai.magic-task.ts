
import { atom } from 'jotai'
import { TypeGenMotive, TypeGenSteps, TypeGenRisk } from '@mytype/typesGenerations'

/* старт → генерация → ок или отменить результат */

export const atomGenMotive = atom<TypeGenMotive>({
    isGen: false,
    fixed: ""
})

export const atomGenSteps = atom<TypeGenSteps>({
    isGen: false,
    fixed: []
})

export const atomGenRisk = atom<TypeGenRisk>({
    isGen: false,
    fixed: null
})