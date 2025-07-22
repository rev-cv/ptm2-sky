const APIURL = import.meta.env.VITE_API_URL
import { getDefaultStore, atomQueryList, addToast } from "@utils/jotai.store"
import { TypeQuery } from '@mytype/typeSaveQueries'

export const updateQuery = async (editingQuery:TypeQuery) => {
    const store = getDefaultStore()
    const queryList = store.get(atomQueryList)

    console.log(editingQuery)

    try {
        const res = await fetch(`${APIURL}/api/upsert_query`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editingQuery)
        })
        if (res.ok) {
            const data = await res.json()
            const updateable:TypeQuery = data.updateable
            store.set(atomQueryList, queryList.map(elem => 
                elem.id === updateable.id ? updateable : elem
            ))
            addToast("Запрос обновлен!")
        } else {
            console.log(res)
            throw new Error(`Редактирование запроса ID ${editingQuery.id}: Ошибка возвращенных данных`)
        }
    } catch (err) {
        console.error(`Ошибка редактирования запроса ID ${editingQuery.id}:`, err)
    }
}
