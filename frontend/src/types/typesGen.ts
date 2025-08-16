import { TypeTasks_Filter, TypeTasks_SubTask, TypeTasks_RI } from '@mytype/typeTask'

export type CommandKeys = keyof typeof Commands
export type CommandValues = typeof Commands[CommandKeys]

export const Commands = {
    // комманды отправляемые на сервер
    SET: 'set', // установить задачу в clients[websocket]["task_obj"], над которой будут производиться операции
    STOP: "stop", // остановить все генерации
    STATUS: "status", // запрос с клиента на статус вполнения задачи (если от сервера ничего не приходит)
    GEN: "gen", // генерация задачи
    GEN_STEPS: "gen_steps", // генерация шагов у задачи
    GEN_MOTIVE: "gen_motive",
    GEN_RISK: "gen_risk",
    GEN_THEME: "gen_theme",
    GEN_STATE: "gen_state",
    GEN_ACTION: "gen_action",
    GEN_STRESS: "gen_stress",
} as const

export const G_Status = {
    // статусы генерации отправлемые сервером
    STARTED: "generation_started",
    PROGRESS: "generation_progress",
    COMPLETED: "generation_completed",
    CANCELLED: "generation_cancelled",
    ERROR: "generation_error",
    TERMINATE: "forced_to_terminate",
    STREAM: "stream",

    NOTSET: "task_not_set", // попытка произвести операцию до того, как был предоставлен объект задачи
    ADDED: "task_added", // задача была успешно добавлена

    UNKNOWN: "unknown" // полученное сообщение не понято
} as const

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

export type TypeGenFilters = {
    isGen: boolean
    fixed: TypeTasks_Filter[]
}