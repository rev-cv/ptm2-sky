const APIURL = import.meta.env.VITE_API_URL
import { loadTasks } from '@api/loadTasks'
import { currentNewTask2, resetTask2, getDefaultStore } from '@utils/jotai.store'

export const createTask = async () => {
    const store = getDefaultStore()
    const originalTask = store.get(currentNewTask2)
    const inTask = {...originalTask}

    try {
        const res = await fetch(`${APIURL}/api/write_task`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(inTask)
        })
        if (res.ok) {
            // const data = await res.json()
            // console.log(data)
            loadTasks()
            store.set(currentNewTask2, resetTask2)
        } else {
            throw new Error(`Создание новой задачи: Ошибка возвращенных данных`)
        }
    } catch (err) {
        console.error(`Ошибка при создании задачи`, err)
    }
}