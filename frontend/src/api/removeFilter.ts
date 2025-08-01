const APIURL = import.meta.env.VITE_API_URL
import { loadFilters } from '@api/loadFilters'
import { addToast } from '@utils/jotai.store'
import { fetchAuth } from '@api/authFetch'

export const removeFilter = async (filterid:number) => {
    try {
        const res = await fetchAuth(`${APIURL}/api/remove_filter`, {
            method: 'POST',
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