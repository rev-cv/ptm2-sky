import { TypeViewTask } from '@mytype/typeTask'
import { getDefaultStore, atomViewTasks } from "@utils/jotai.store"

export function taskChangeDetector (editingTask:TypeViewTask) : boolean {
    const e = editingTask
    const o = getDefaultStore()
        .get(atomViewTasks)
        .find(obj => obj.id === e.id)

    if (!o) return false

    // проверки

    if (o.status != e.status) return true
    if (o.title.trim() != e.title.trim()) return true
    if (o.description != e.description) return true
    if (o.motivation != e.motivation) return true

    if (o.activation != e.activation) return true
    if (o.deadline != e.deadline) return true

    if (o.taskchecks.length != e.taskchecks.length) return true
    for (let index = 0; index < e.taskchecks.length; index++) {
        if (!o.taskchecks.includes(e.taskchecks[index])) {
            return true
        }
    }

    if (o.risk != e.risk) return true
    if (o.impact != e.impact) return true

    if (o.risk_proposals != e.risk_proposals) return true
    if (o.risk_explanation != e.risk_explanation) return true

    // проверка фильтров
    if (taskChangeFIltersDetector(o, e)) return true
    
    // проверка подзадач
    if (taskChangeSubtasksDetector(o, e)) return true

    return false
}

export function taskChangeFIltersDetector (originalTask:TypeViewTask, editingTas: TypeViewTask) {
    const o = originalTask
    const e = editingTas

    const getFilterIds = (obj:TypeViewTask) => {
        const arrays = [
            obj.filters.theme,
            obj.filters.stress,
            obj.filters.action_type,
            ...Object.values(obj.filters.state)
        ]
        return arrays.flatMap(arr => arr.map(elem => elem.id))
    }

    const getFilterReasons = (obj:TypeViewTask) => {
        const arrays = [
            obj.filters.theme,
            obj.filters.stress,
            obj.filters.action_type,
            ...Object.values(obj.filters.state)
        ]
        return arrays.flatMap(arr => arr.map(elem => elem.reason))
    }

    const ofi = getFilterIds(o)
    const efi = getFilterIds(e)

    if (ofi.length != efi.length) return true
    for (let index = 0; index < ofi.length; index++) {
        if (!ofi.includes(efi[index])) return true
        // если длина списка одинаковая и 
        // все елементы из одного списка присутствуют в другом
        // то оба списка идентичны
    }

    const ofr = getFilterReasons(o)
    const efr = getFilterReasons(e)

    for (let index = 0; index < ofr.length; index++) {
        if (ofr[index] != efr[index]) return true
    }

    return false
}

export function taskChangeSubtasksDetector (originalTask:TypeViewTask, editingTas: TypeViewTask) {
    const o = originalTask
    const e = editingTas

    if (o.subtasks.length != e.subtasks.length) return true

    for (let index = 0; index < e.subtasks.length; index++) {
        const es = e.subtasks[index]
        if (es.id < 0) return true // подзадача еще не добавлена

        const os = o.subtasks.find(elem => elem.id === es.id)
        if (!os) return true

        if (os.status != es.status) return true
        if (os.title.trim() != es.title.trim()) return true
        if (os.description != es.description) return true
        if (os.instruction != es.instruction) return true
        if (os.motivation != es.motivation) return true
        if (os.continuance != es.continuance) return true
        if (os.order != es.order) return true
    }

    return false
}