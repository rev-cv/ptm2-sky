
export type TypeFilters = {
    type: string // тип фильтра
    id: number
    value: string
}

export type TypeDatePeriods = [string | null, string | null]
export type TypeRiskImpact = 0 | 1 | 2 | 3

export type TypeSearchPanel = {
    text: string
    filters: TypeFilters[]
    lastOpenedPage: number
    sorted: ""
    activation: TypeDatePeriods
    deadline: TypeDatePeriods
    taskchecks: TypeDatePeriods
    risk: TypeRiskImpact[],
    impact: TypeRiskImpact[],
}
