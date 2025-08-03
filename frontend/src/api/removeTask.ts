const APIURL = import.meta.env.VITE_API_URL
import { addToast, atomViewTasks, getDefaultStore } from '@utils/jotai.store'
import { fetchAuth } from '@api/authFetch'

export const removeTask = async (taskid:number) => {
    const store = getDefaultStore()
    try {
        const res = await fetchAuth(`${APIURL}/api/remove_task`, {
            method: 'POST',
            body: JSON.stringify({taskid})
        })
        if (res.ok) {
            store.set(atomViewTasks, prev => prev.filter(elem => elem.id != taskid))
            addToast("Задача удалена!", "delete")
        } else {
            throw new Error(`Удаление задачи с id=${taskid}: Ошибка возвращенных данных`)
        }
    } catch (err) {
        console.error(`Ошибка при удалении задачи с id=${taskid}`, err)
    }
}