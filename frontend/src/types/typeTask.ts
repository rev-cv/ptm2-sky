
export const PagesForTaskEditor = {
    MAIN: 0,
    STEP: 1,
    TIME: 2,
    RISK: 3,
    THEME: 4,
    ADAPT: 5,
    INTENSITY: 6,
    ACTION: 7,
    STRESS: 8,
    STATE: 9
}

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
    created_at?: string
    finished_at?: string
}

export type TypeTasks_Filter = {
    id: number
    idf: number // ассоциировано с фильтром
    name?: string // название фильтра
    description?: string // описание фильтра
    reason: string // причина релевантности
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
    finished_at: string | null
    // дата успешного выполнения задачи (когда status установлен в значение True)
    // дата провала - deadline, если он меньше текущего времени
    deadline: string | null // время дедлайна
    activation: string | null // время активации задачи
    taskchecks: string[] // даты проверки задачи

    risk: TypeTasks_RI
    impact: TypeTasks_RI
    risk_proposals: string
    risk_explanation: string

    stress: TypeTasks_RI
    apathy:  TypeTasks_RI
    meditative:  TypeTasks_RI
    comfort:  TypeTasks_RI
    automaticity:  TypeTasks_RI
    significance:  TypeTasks_RI
    
    physical:  TypeTasks_RI
    intellectual:  TypeTasks_RI
    motivational:  TypeTasks_RI
    emotional:  TypeTasks_RI
    financial:  TypeTasks_RI
    temporal:  TypeTasks_RI
    social: TypeTasks_RI

    themes: TypeTasks_Filter[]
    actions: TypeTasks_Filter[]
}

export type TypeReturnTask = Partial<Omit<TypeViewTask, 'themes' | 'actions'>> & {
    id: number; // id остаётся обязательным
    filter_list?: TypeTasks_Filter[]
}
