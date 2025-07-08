const APIURL = import.meta.env.VITE_API_URL
import { loadTasks } from '@api/loadTasks'
import { addToast } from '@utils/jotai.store'

export const removeTask = async (taskid:number) => {
    try {
        const res = await fetch(`${APIURL}/api/remove_task`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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