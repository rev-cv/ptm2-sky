import { TypeViewTask } from '@mytype/typeTask'
import { getDefaultStore, atomViewTasks } from "@utils/jotai.store"

export function taskChangeDetector (editingTask:TypeViewTask) : boolean {
    const e = editingTask
    const o = getDefaultStore()
        .get(atomViewTasks)
        .find(obj => obj.id === e.id)

    if (!o) return false

    // проверки

    const fieldsToCompare: (keyof TypeViewTask)[] = ['status', 'activation', 'deadline', 'risk', 'impact', 'stress', 'apathy', 'meditative', 'comfort', 'automaticity', 'significance', 'physical', 'intellectual', 'motivational', 'emotional', 'financial', 'temporal', 'social']
    for (let index = 0; index < fieldsToCompare.length; index++) {
        const name = fieldsToCompare[index]
        if (o[name] != e[name]) {
            return true
        }
    }

    const fieldsToCompareText: (keyof TypeViewTask)[] = ['title', 'description', 'motivation', 'risk_proposals', 'risk_explanation']
    for (let index = 0; index < fieldsToCompareText.length; index++) {
        const name = fieldsToCompareText[index]
        if ((o[name] as string).trim() !== (e[name] as string).trim()) {
            return true
        }
    }

    // проверка фильтров
    if (taskChangeFIltersDetector(o, e)) return true
    
    // проверка подзадач
    if (taskChangeSubtasksDetector(o, e)) return true

    if (o.taskchecks.length != e.taskchecks.length) return true
    for (let index = 0; index < e.taskchecks.length; index++) {
        if (!o.taskchecks.includes(e.taskchecks[index])) {
            return true
        }
    }

    return false
}

export function taskChangeFIltersDetector (originalTask:TypeViewTask, editingTas: TypeViewTask) {
    const o = originalTask
    const e = editingTas

    const getFilterIds = (obj:TypeViewTask) => {
        const arrays = [obj.themes, obj.actions]
        return arrays.flatMap(arr => arr.map(elem => elem.id))
    }

    const getFilterReasons = (obj:TypeViewTask) => {
        const arrays = [obj.themes, obj.actions]
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