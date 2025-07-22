const APIURL = import.meta.env.VITE_API_URL
import { addToast } from '@utils/jotai.store'
import { loadQueries } from '@api/loadQueries'

export const removeQuery = async (queryid:number) => {
    try {
        const res = await fetch(`${APIURL}/api/remove_query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({queryid})
        })
        if (res.ok) {
            loadQueries()
            addToast("Сохраненный запрос удален!", "delete")
        } else {
            throw new Error(`Удаление задачи с id=${queryid}: Ошибка возвращенных данных`)
        }
    } catch (err) {
        console.error(`Ошибка при удалении задачи с id=${queryid}`, err)
    }
}