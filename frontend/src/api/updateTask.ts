const APIURL = import.meta.env.VITE_API_URL
import { TypeViewTask, TypeReturnTask, TypeTasks_Filter } from '@mytype/typeTask'
import { getDefaultStore, viewTasks, addToast } from "@utils/jotai.store"
import { taskChangeFIltersDetector, taskChangeSubtasksDetector } from '@utils/task-change-detector'

export const updateTask = async (editingTask:TypeViewTask) => {
    const changesInTask:TypeReturnTask = { id: editingTask.id }

    const store = getDefaultStore()
    const tasks = store.get(viewTasks)

    const e = editingTask
    const o = tasks.find(obj => obj.id === e.id)

    if (!o) return false

    if (o.status != e.status) {
        if (!o.status && e.status) {
            changesInTask.finished_at = new Date().toISOString()
        } else {
            changesInTask.finished_at = ""
        }
        changesInTask.status = e.status
    }

    if (o.title.trim() != e.title.trim())
        changesInTask.title = e.title.trim().replace(/\n{3,}/g, '\n\n')

    if (o.description != e.description)
        changesInTask.description = e.description.trim().replace(/\n{3,}/g, '\n\n')

    if (o.motivation != e.motivation)
        changesInTask.motivation = e.motivation.trim().replace(/\n{3,}/g, '\n\n')

    if (o.activation != e.activation)
        changesInTask.activation = e.activation === null ? "" : e.activation

    if (o.deadline != e.deadline)
        changesInTask.deadline = e.deadline === null ? "" : e.deadline

    const isTaskCheckDetect = () => {
        if (o.taskchecks.length != e.taskchecks.length) return true
        for (let index = 0; index < e.taskchecks.length; index++) {
            if (!o.taskchecks.includes(e.taskchecks[index])) 
                return true
        }
        return false
    }

    if (isTaskCheckDetect())
        changesInTask.taskchecks = e.taskchecks

    if (o.risk != e.risk)
        changesInTask.risk = e.risk

    if (o.impact != e.impact)
        changesInTask.impact = e.impact

    if (o.risk_proposals != e.risk_proposals)
        changesInTask.risk_proposals = e.risk_proposals.trim().replace(/\n{3,}/g, '\n\n')

    if (o.risk_explanation != e.risk_explanation)
        changesInTask.risk_explanation = e.risk_explanation.trim().replace(/\n{3,}/g, '\n\n')

    if (taskChangeFIltersDetector(o, e)) {
        const result: TypeTasks_Filter[] = []

        e.filters.theme.forEach(filter => {
            result.push({ id: filter.id, idf: filter.idf, reason: filter.reason.trim().replace(/\n{3,}/g, '\n\n') })
        });

        Object.values(e.filters.state).forEach(filters => {
            filters.forEach(filter => {
                result.push({ id: filter.id, idf: filter.idf, reason: filter.reason.trim().replace(/\n{3,}/g, '\n\n') })
            });
        });

        e.filters.stress.forEach(filter => {
            result.push({ id: filter.id, idf: filter.idf, reason: filter.reason.trim().replace(/\n{3,}/g, '\n\n') })
        });

        e.filters.action_type.forEach(filter => {
            result.push({ id: filter.id, idf: filter.idf, reason: filter.reason.trim().replace(/\n{3,}/g, '\n\n') })
        });

        changesInTask.filter_list = result
    }

    if (taskChangeSubtasksDetector(o, e)) {
        changesInTask.subtasks = e.subtasks
    }

    try {
        const res = await fetch(`${APIURL}/api/upsert_task`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(changesInTask)
        })
        if (res.ok) {
            const data = await res.json()
            const updateable: TypeViewTask = data.updateable
            store.set(viewTasks, tasks.map(elem => 
                elem.id === updateable.id ? updateable : elem
            ))
            console.log(updateable.deadline)

            addToast("Задача обновлена!")
        } else {
            throw new Error(`Редактирование задачи ${e.id}: Ошибка возвращенных данных`)
        }
    } catch (err) {
        console.error(`Ошибка редактирования задачи ${e.id}:`, err)
    }
}
