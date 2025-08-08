import { TypeTasks_SubTask, TypeTasks_RI } from '@mytype/typeTask'

export type TypeGenMotive = {
    isGen: boolean
    fixed: string
}

export type TypeGenSteps = {
    isGen: boolean
    fixed: TypeTasks_SubTask[]
}

export type TypeGenRisk__Fixed = {
    risk: TypeTasks_RI
    risk_proposals: string
    risk_explanation: string
}

export type TypeGenRisk = {
    isGen: boolean
    fixed: null | TypeGenRisk__Fixed

}