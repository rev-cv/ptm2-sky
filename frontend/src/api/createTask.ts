const APIURL = import.meta.env.VITE_API_URL
import { TypeReturnTask, TypeTasks_Filter } from '@mytype/typeTask'
import { loadTasks } from '@api/loadTasks2'
import { currentNewTask2, resetTask2, getDefaultStore, addToast } from '@utils/jotai.store'
import { fetchAuth } from '@api/authFetch'

export const createTask = async () => {
    const store = getDefaultStore()
    const originalTask = store.get(currentNewTask2)

    const { filters, ...rest } = originalTask;

    let filts:TypeTasks_Filter[] = []

    filters.theme.forEach(filter => {
        filts.push({ id: filter.id, idf: filter.idf, reason: filter.reason.trim().replace(/\n{3,}/g, '\n\n') })
    })

    Object.values(filters.state).forEach(filters => {
        filters.forEach(filter => {
            filts.push({ id: filter.id, idf: filter.idf, reason: filter.reason.trim().replace(/\n{3,}/g, '\n\n') })
        })
    })

    filters.stress.forEach(filter => {
        filts.push({ id: filter.id, idf: filter.idf, reason: filter.reason.trim().replace(/\n{3,}/g, '\n\n') })
    })

    filters.action_type.forEach(filter => {
        filts.push({ id: filter.id, idf: filter.idf, reason: filter.reason.trim().replace(/\n{3,}/g, '\n\n') })
    })

    const inTask:TypeReturnTask = {...rest, filter_list: filts}

    try {
        const res = await fetchAuth(`${APIURL}/api/upsert_task`, {
            method: 'POST',
            body: JSON.stringify(inTask)
        })
        if (res.ok) {
            loadTasks()
            store.set(currentNewTask2, resetTask2)
            addToast("Добавлена новая задача!")
        } else {
            throw new Error(`Создание новой задачи: Ошибка возвращенных данных`)
        }
    } catch (err) {
        console.error(`Ошибка при создании задачи`, err)
    }
}