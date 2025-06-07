import { z } from "zod"

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
    name: string
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
    risk_explanation?: string
    risk_proposals?: string
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


export const newTaskSchema = z.object({
    title: z.string().min(6, "Task title must be at least 6 characters"),
    description: z.string(),
    motivation: z.string().optional(),
    match_themes: z.array(
        z.object({
            id: z.number().nullable(),
            name: z.string(),
            description: z.string().optional(),
            match_percentage: z.number(),
            reason: z.string()
        })
    ).optional(),
    new_themes: z.array(
        z.object({
            id: z.number().nullable(),
            name: z.string(),
            description: z.string().optional(),
            match_percentage: z.number(),
            reason: z.string()
        })
    ).optional(),
    subtasks: z.array(
        z.object({
            title: z.string(),
            description: z.string(),
            instruction: z.string(),
            continuance: z.number(),
            motivation: z.string()
        })
    ).optional(),
    risk: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]).optional(),
    risk_explanation: z.string().optional(),
    risk_proposals: z.string().optional(),
    impact: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]).optional(),
    states: z.object({
        physical: z.array(
            z.object({
                id: z.number(),
                name: z.string(),
                description: z.string(),
                reason: z.string()
            })
        ),
        intellectual: z.array(
            z.object({
                id: z.number(),
                name: z.string(),
                description: z.string(),
                reason: z.string()
            })
        ),
        emotional: z.array(
            z.object({
                id: z.number(),
                name: z.string(),
                description: z.string(),
                reason: z.string()
            })
        ),
        motivational: z.array(
            z.object({
                id: z.number(),
                name: z.string(),
                description: z.string(),
                reason: z.string()
            })
        ),
        social: z.array(
            z.object({
                id: z.number(),
                name: z.string(),
                description: z.string(),
                reason: z.string()
            })
        )
    }).optional(),
    action_type: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
            description: z.string(),
            reason: z.string()
        })
    ).optional(),
    stress: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
            description: z.string(),
            reason: z.string()
        })
    ).optional(),
    energy_level: z.array(
        z.object({
            id: z.number(),
            name: z.string(),
            description: z.string(),
            reason: z.string()
        })
    ).optional(),
    deadline: z.string().nullable().optional(),
    activation: z.string().nullable().optional(),
    taskchecks: z.array(z.string()).optional()
});