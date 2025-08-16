const APIURL = import.meta.env.VITE_API_URL
import { TypeReturnTask, TypeTasks_Filter } from '@mytype/typeTask'
import { loadTasks } from '@api/loadTasks2'
import { currentNewTask2, resetTask2, getDefaultStore, addToast } from '@utils/jotai.store'
import { fetchAuth } from '@api/authFetch'
import { loadFilters } from '@api/loadFilters'

export const createTask = async () => {
    const store = getDefaultStore()
    const originalTask = store.get(currentNewTask2)
    let isAddingNewTheme = false

    const { themes, actions, ...rest } = originalTask;

    let filts:TypeTasks_Filter[] = []

    themes.forEach(filter => {
        filts.push({ 
            id: filter.id, 
            idf: filter.idf, 
            reason: filter.reason.trim().replace(/\n{3,}/g, '\n\n'),
            description: filter.description?.trim().replace(/\n{3,}/g, '\n\n'),
            name: filter.name?.trim()
        })

        if (filter.idf < 0) {
            isAddingNewTheme = true
        }
    })

    actions.forEach(filter => {
        filts.push({ 
            id: filter.id, 
            idf: filter.idf, 
            reason: filter.reason.trim().replace(/\n{3,}/g, '\n\n')
        })
    })

    const inTask:TypeReturnTask = {...rest, filter_list: filts}

    try {
        const res = await fetchAuth(`${APIURL}/api/upsert_task`, {
            method: 'POST',
            body: JSON.stringify(inTask)
        })
        if (res.ok) {
            loadTasks()
            store.set(currentNewTask2, structuredClone(resetTask2))
            addToast("Добавлена новая задача!")

            // Если во время добавления / обновления была добавлена задача, 
            // следует обновить состояние фильтров
            if (isAddingNewTheme) {
                loadFilters()
                addToast("Добавлены новые фильтры!")
            }
        } else {
            throw new Error(`Создание новой задачи: Ошибка возвращенных данных`)
        }
    } catch (err) {
        console.error(`Ошибка при создании задачи`, err)
    }
}