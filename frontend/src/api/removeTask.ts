const APIURL = import.meta.env.VITE_API_URL
import { loadTasks } from '@api/loadTasks2'
import { addToast } from '@utils/jotai.store'
import { fetchAuth } from '@api/authFetch'

export const removeTask = async (taskid:number) => {
    try {
        const res = await fetchAuth(`${APIURL}/api/remove_task`, {
            method: 'POST',
            body: JSON.stringify({taskid})
        })
        if (res.ok) {
            loadTasks()
            addToast("Задача удалена!", "delete")
        } else {
            throw new Error(`Удаление задачи с id=${taskid}: Ошибка возвращенных данных`)
        }
    } catch (err) {
        console.error(`Ошибка при удалении задачи с id=${taskid}`, err)
    }
}