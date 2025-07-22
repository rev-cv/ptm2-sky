const APIURL = import.meta.env.VITE_API_URL
import { loadFilters } from '@api/loadFilters'
import { addToast } from '@utils/jotai.store'

export const removeFilter = async (filterid:number) => {
    try {
        const res = await fetch(`${APIURL}/api/remove_filter`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({filterid})
        })
        if (res.ok) {
            loadFilters()
            addToast("Фильтер удален!", "delete")
        } else {
            throw new Error(`Удаление фильтра с id=${filterid}: Ошибка возвращенных данных`)
        }
    } catch (err) {
        console.error(`Ошибка при удалении фильтра с id=${filterid}`, err)
    }
}