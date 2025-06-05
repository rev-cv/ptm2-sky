import { atom } from 'jotai'
import { TypeSearchPanel } from '@mytype/typeSearchAndFilter'

// атом для хранения запроса для получения задач
export const searchRequest = atom<TypeSearchPanel>({
    text: "",
    filters: [],
    lastOpenedPage: 1,
    sorted: "",
    activation: [null, null],
    deadline: [null, null],
    taskchecks: [null, null],
    risk: [],
    impact: [],
})

export const searchRequestID = atom((get) => 
    get(searchRequest).filters.map(f => f.id)
)