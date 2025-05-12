
export type TypeThemes = {
    id: number | null
    name: string
    description?: string
    match_percentage: number
    reason: string
}

export type TypeSubTask = {
    title: string
    description: string
    instruction: string
    continuance: number
    motivation: string
}

export type TypeAssociation = {
    id: number
    title: string
    description: string
    reason:string
}

export type TypeNewTask = {
	title: string
	description: string
    motivation?: string
	match_themes?: TypeThemes[]
    new_themes?: TypeThemes[]
    subtasks?: TypeSubTask[]
    risk?: 0 | 1 | 2 | 3
    risk_explanation?: {
        reason: string
        proposals: string
    }
    impact?: 0 | 1 | 2 | 3
    states?: {
        physical: TypeAssociation[]
        intellectual: TypeAssociation[]
        emotional: TypeAssociation[]
        motivational: TypeAssociation[]
        social: TypeAssociation[]
    }
    action_type?: TypeAssociation[]
    stress?: TypeAssociation[]
    energy_level?: TypeAssociation[]
    deadline?: string | null     // время дедлайна
    activation?: string | null   // время активации задачи
    taskchecks?: string[]        // даты проверки задачи
}
