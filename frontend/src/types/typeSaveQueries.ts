import { TypeTasks_RI } from '@mytype/typeTask'

export type TypeSortOption =
    | "created_asc"
    | "created_desc"
    | "deadline_asc"
    | "deadline_desc"
    | "activation_asc"
    | "activation_desc"
    | "name_asc"
    | "name_desc"
    | "risk_asc"
    | "risk_desc"
    | "impact_asc"
    | "impact_desc"

type TypeRange = string
// "start…finish" - ищется дата в пределах start - finish. Пример 2025-04-23…2025-05-05
// "null…finish" - ищется дата вплоть до finish. Пример null…2025-05-05
// "start…null" - ищется дата от start
// "ignore" - фильтер игнорируется
// "availability" - отбор, если имеется дата впринципе
// "absence" - отбор, если дата отсутствует
// "NEXT#3" - от начала сегоднешнего дня и до #[число] кол-во дней
// "LAST#10" - 10 дней в прошлом начиная от конца вчерашнего дня 

type TypeRule = "ignore" | "" | "exclude" | "tostart" | "toend"
// "ignore" | "" - игнорировать правило
// "exclude" - исключить из выдачи
// "tostart" - поместить в начало
// "toend" - поместить в конец

export const ruleDoneFailList:TypeRule[] = ["ignore", "exclude", "tostart", "toend"]

export type TypeQuery = {
    id: number
    name: string      // отображаемое название запроса
    descr: string
    q: string         // текст искомый в title, description

    infilt: number[]  // id искомых фильтров
    exfilt: number[]  // id исключаемых фильтров

    crange: TypeRange 
    arange: TypeRange
    drange: TypeRange
    irange: TypeRange // inspections - проверки, направленные на анализ и контроль

    donerule: TypeRule
    failrule: TypeRule
    
    inrisk: TypeTasks_RI[] // присоединить задачи с заданным риском
    exrisk: TypeTasks_RI[] // исключить задачи с заданным риском

    inimpact: TypeTasks_RI[] // присоединить задачи с заданными последствиями
    eximpact: TypeTasks_RI[] // исключить задачи с заданными последствиями

    sort: TypeSortOption[]

    is_default: boolean // в любой непонятной ситуации выполняется запрос с is_default == true
    page: 1
}

