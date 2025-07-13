import { TypeTasks_RI } from '@mytype/typeTask'

type TypeSortOption =
    | "CreatedAsc"
    | "CreatedDesc"
    | "DeadlineAsc"
    | "DeadlineDesc"
    | "ActivationAsc"
    | "ActivationDesc"
    | "NameAsc"
    | "NameDesc"
    | "RiskAsc"
    | "RiskDesc"
    | "ImpactAsc"
    | "ImpactDesc"

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

