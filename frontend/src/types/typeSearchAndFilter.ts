
export type TypeFilters = {
    type: string // тип фильтра
    id: number
    value: string
}

export type TypeSearchPanel = {
    text: string
    filters: TypeFilters[]
    lastOpenedPage: number
    sorted: ""
}
