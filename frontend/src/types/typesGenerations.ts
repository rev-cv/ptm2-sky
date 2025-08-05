import { TypeTasks_SubTask } from '@mytype/typeTask'

export type TypeGenMotive = {
    isGen: boolean
    fixed: string
}

export type TypeGenSteps = {
    isGen: boolean
    fixed: TypeTasks_SubTask[]
}
