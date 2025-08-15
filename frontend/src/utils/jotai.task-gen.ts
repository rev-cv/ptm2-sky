
import { atom } from 'jotai'
import * as t from '@mytype/typesGen'

/* старт → генерация → ок или отменить результат */

export const atomGenMotive = atom<t.TypeGenMotive>({
    isGen: false,
    fixed: ""
})

export const atomGenSteps = atom<t.TypeGenSteps>({
    isGen: false,
    fixed: []
})

export const atomGenRisk = atom<t.TypeGenRisk>({
    isGen: false,
    fixed: null
})

export const atomGenTheme = atom<t.TypeGenFilters>({
    isGen: false,
    fixed: []
})

export const atomGenAction = atom<t.TypeGenFilters>({
    isGen: false,
    fixed: []
})