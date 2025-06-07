import { z } from "zod"

export type TypeFilter = {
    type: string // тип фильтра
    id: number
    value: string
    type_title: string
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
    risk: TypeRiskImpact[]
    impact: TypeRiskImpact[]
}

export type TypeFilterAssocServer_state = {
    emotional: TypeFilterServer[]
    intellectual: TypeFilterServer[]
    motivational: TypeFilterServer[]
    physical: TypeFilterServer[]
    social: TypeFilterServer[]
}

export type TypeFilterAssocServer = {
    // типология фильтров жестко фиксирована на данный момент
    action_type: TypeFilterServer[]
    state: TypeFilterAssocServer_state
    stress: TypeFilterServer[]
    theme: TypeFilterServer[]
}

export const searchRequestSchema = z.object({
    text: z.string(),
    filters: z.array(z.object({
        type: z.string(),
        id: z.number(),
        value: z.string(),
        type_title: z.string(),
    })),
    lastOpenedPage: z.number(),
    sorted: z.string(),
    activation: z.tuple([z.string().nullable(), z.string().nullable()]),
    deadline: z.tuple([z.string().nullable(), z.string().nullable()]),
    taskchecks: z.tuple([z.string().nullable(), z.string().nullable()]),
    risk: z.array(z.number()),
    impact: z.array(z.number()),
});