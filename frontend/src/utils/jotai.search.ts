import { atom } from 'jotai'
import { TypeSearchPanel, searchRequestSchema } from '@mytype/typeSearchAndFilter'

// атом для хранения запроса для получения задач
export const searchRequest = atom<TypeSearchPanel>(
    getSearchRequest("default")
)

export const searchRequestID = atom((get) => 
    get(searchRequest).filters.map(f => f.id)
)

type TypeSamplingStatus = 'idle' | 'loading' | 'success' | 'error'

export const samplingStatus = atom<TypeSamplingStatus>("idle")

export function getSearchRequest (searchRequestType: string) {
    let request:TypeSearchPanel = {
        text: "",
        filters: [],
        lastOpenedPage: 1,
        sorted: "",
        activation: [null, null],
        deadline: [null, null],
        taskchecks: [null, null],
        risk: [],
        impact: [],
    }

    const nowDate = new Date()
    nowDate.setHours(0, 0, 0, 0)
    const tomorrowDate = new Date(nowDate)

    switch (searchRequestType) {
        case "default":
            return request
        case "today": // запрос для задач на сегодня
            tomorrowDate.setDate(nowDate.getDate() + 1)
            request.deadline = [
                nowDate.toISOString(), 
                tomorrowDate.toISOString()
            ]
            return request
        case "3day":
            tomorrowDate.setDate(nowDate.getDate() + 3)
            request.deadline = [
                nowDate.toISOString(), 
                tomorrowDate.toISOString()
            ]
            return request
        case "7day":
            tomorrowDate.setDate(nowDate.getDate() + 7)
            request.deadline = [
                nowDate.toISOString(), 
                tomorrowDate.toISOString()
            ]
            return request
        case "overdue":
            tomorrowDate.setDate(nowDate.getDate() + 7)
            request.deadline = [null, nowDate.toISOString()]
            return request            
        default:
            throw new Error("Unknown search request type")
    }
}

export function deepEqual(type: string, obj: any): boolean {

    if (!searchRequestSchema.safeParse(obj).success) return false

    const original = getSearchRequest(type);
    
    if (original.text != obj.text) return false
    if (original.sorted != obj.sorted) return false

    if (original.activation[0] != obj.activation[0]) return false
    if (original.activation[1] != obj.activation[1]) return false
    if (original.deadline[0] != obj.deadline[0]) return false
    if (original.deadline[1] != obj.deadline[1]) return false

    return true;
}
