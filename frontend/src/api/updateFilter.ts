const APIURL = import.meta.env.VITE_API_URL
import { getDefaultStore, atomFilterList, addToast } from "@utils/jotai.store"
import { TypeFilterNew } from '@mytype/typeFilters'

export const updateFilter = async (editingFilter:TypeFilterNew) => {
    const store = getDefaultStore()
    const queryList = store.get(atomFilterList)

    try {
        const res = await fetch(`${APIURL}/api/upsert_filter`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editingFilter)
        })
        if (res.ok) {
            const data = await res.json()
            const updateable:TypeFilterNew = data.updateable
            store.set(atomFilterList, queryList.map(elem => 
                elem.id === updateable.id ? updateable : elem
            ))
            addToast("Фильтр обновлен!")
        } else {
            console.log(res)
            throw new Error(`Редактирование фильтра ID ${editingFilter.id}: Ошибка возвращенных данных`)
        }
    } catch (err) {
        console.error(`Ошибка редактирования фильтра ID ${editingFilter.id}:`, err)
    }
}
