const APIURL = import.meta.env.VITE_API_URL
import { TypeFilterNew } from '@mytype/typeFilters'
import { addToast, atomFilterList, getDefaultStore } from '@utils/jotai.store'

export const createFilter = async (newfilter:TypeFilterNew) => {

    const store = getDefaultStore()

    try {
        const res = await fetch(`${APIURL}/api/upsert_filter`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newfilter)
        })
        if (res.ok) {
            const data = await res.json()
            const queryList = store.get(atomFilterList)
            store.set(atomFilterList, [...queryList, data.updateable])
            addToast("Добавлен новый фильтр!")
        } else {
            throw new Error(`Создание нового фильтра: Ошибка возвращенных данных`)
        }
    } catch (err) {
        console.error(`Ошибка при создании фильтра`, err)
    }
}