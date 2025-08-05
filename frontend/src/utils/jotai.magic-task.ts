
import { atom } from 'jotai'
import { TypeGenMotive, TypeGenSteps } from '@mytype/typesGenerations'

/* старт → генерация → ок или отменить результат */

export const atomGenMotive = atom<TypeGenMotive>({
    isGen: false,
    fixed: ""
})

export const atomGenSteps = atom<TypeGenSteps>({
    isGen: false,
    fixed: []
})