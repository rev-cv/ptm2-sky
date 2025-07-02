
export type TypeTasks_SubTask = {
    id: number
    status: boolean
    title: string
    description: string
    continuance: number // продолжительность выполнения подзадачи в часах
    instruction: string
    motivation?: string
    task_id?: number // ID задачи, к которой относится подзадача
    order: number
}

export type TypeTasks_Filter = {
    id: number
    idf: number // ассоциировано с фильтром
    name?: string // название фильтра
    description?: string // описание фильтра
    reason: string // причина релевантности
    proposals?: string | null // предложения по фильтру
}

export type TypeTasks_RI = 0 | 1 | 2 | 3

export type TypeViewTask = {
    // тип данных отдаваемых сервером
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

    risk: TypeTasks_RI
    impact: TypeTasks_RI
    risk_proposals: string
    risk_explanation: string
    
    filters: { // формат в котором фильтры приходят с сервера
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

export type TypeStates = "physical" | "intellectual" | "emotional" | "motivational" | "social"


export type TypeReturnTask = {
    // тип данных задачи отправляемых на сервер
    id: number
    status?: boolean
    title?: string
    description?: string
    motivation?: string
    subtasks?: TypeTasks_SubTask[]

    created_at?: string // дата создания задачи
    deadline?: string | null // время дедлайна
    activation?: string | null // время активации задачи
    taskchecks?: string[] // даты проверки задачи

    risk?: TypeTasks_RI
    impact?: TypeTasks_RI
    risk_proposals?: string
    risk_explanation?: string

    filter_list?: TypeTasks_Filter[] // формат в котором фильтры уходят на сервер
}