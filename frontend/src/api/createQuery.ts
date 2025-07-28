const APIURL = import.meta.env.VITE_API_URL
import { TypeQuery } from '@mytype/typeQueries'
import { addToast, atomQueryList, getDefaultStore } from '@utils/jotai.store'

export const createQuery = async (newquery:TypeQuery) => {

    const store = getDefaultStore()

    try {
        const res = await fetch(`${APIURL}/api/upsert_query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newquery)
        })
        if (res.ok) {
            const data = await res.json()
            const queryList = store.get(atomQueryList)
            store.set(atomQueryList, [...queryList, data.updateable])
            addToast("Добавлен новый запрос!")
        } else {
            throw new Error(`Создание новой задачи: Ошибка возвращенных данных`)
        }
    } catch (err) {
        console.error(`Ошибка при создании задачи`, err)
    }
}