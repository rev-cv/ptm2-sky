
export type TypeFilter = {
    type: string // тип фильтра
    id: number
    value: string
}

export type TypeFilterServer = {
    // фильтры приходящие с сервера
    id: number
    name: string
    description: string
    is_user_defined: boolean
}

export type TypeDatePeriods = [string | null, string | null]
export type TypeRiskImpact = 0 | 1 | 2 | 3

export type TypeSearchPanel = {
    text: string
    filters: TypeFilter[]
    lastOpenedPage: number
    sorted: ""
    activation: TypeDatePeriods
    deadline: TypeDatePeriods
    taskchecks: TypeDatePeriods
    risk: TypeRiskImpact[],
    impact: TypeRiskImpact[],
}

export type TypeFilterAssocServer = {
    // типология фильтров жестко фиксирована на данный момент
    action_type: TypeFilterServer[]
    energy_level: TypeFilterServer[]
    state: {
        emotional: TypeFilterServer[]
        intellectual: TypeFilterServer[]
        motivational: TypeFilterServer[]
        physical: TypeFilterServer[]
        social: TypeFilterServer[]
    }
    stress: TypeFilterServer[]
    theme: TypeFilterServer[]
}