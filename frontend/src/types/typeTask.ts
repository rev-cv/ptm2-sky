
export type TypeTasks_SubTask = {
    id: number
    status: boolean
    title: string
    description: string
    continuance: number // продолжительность выполнения подзадачи в часах
    instruction: string
    motivation?: string
    task_id: number // ID задачи, к которой относится подзадача
    order: number
}

export type TypeTasks_Filter = {
    id: number
    name: string // название фильтра
    description: string // описание фильтра
    reason: string // причина релевантности
    proposals?: string | null // предложения по фильтру
}

export type TypeViewTask = {
    id: number
    status: boolean
    title: string
    description: string
    motivation: string
    subtasks: TypeTasks_SubTask[]

    created_at: string // дата создания задачи
    deadline: string | null // время дедлайна
    activation: string | null // время активации задачи
    taskchecks: string[] // даты проверки задачи

    risk: 0 | 1 | 2 | 3
    impact: 0 | 1 | 2 | 3
    risk_proposals: string
    risk_explanation: string
    
    filters: {
        theme: TypeTasks_Filter[]
        state: {
            physical: TypeTasks_Filter[]
            intellectual: TypeTasks_Filter[]
            emotional: TypeTasks_Filter[]
            motivational: TypeTasks_Filter[]
            social: TypeTasks_Filter[]
        }
        stress: TypeTasks_Filter[]
        action_type: TypeTasks_Filter[]
    }
}
