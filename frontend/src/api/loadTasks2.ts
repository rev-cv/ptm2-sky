const APIURL = import.meta.env.VITE_API_URL
import { getDefaultStore, atomQuerySelect, viewTasks, samplingStatus } from '@utils/jotai.store'

export const loadTasks = async (isSubstitution=false) => {
    const store = getDefaultStore()

    // очистка текущих отображаемых задач, если это не запрос для пагинации

    if (isSubstitution) {
        store.set(viewTasks, [])
    }

    const body = store.get(atomQuerySelect)

    // инициализация запроса и обработка результата
    store.set(samplingStatus, 'loading')

    try {
        const res = await fetch(`${APIURL}/api/get_tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({...body})
        })
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Ошибка поиска: ${errText}`);
        }
        const data = await res.json()

        setTimeout(() => {
            store.set(viewTasks, data.result)
            store.set(samplingStatus, 'success')
        }, 0) // имитация задержки для отладки

        
    } catch (err) {
        store.set(samplingStatus, 'error')
        console.error('Ошибка поиска задач:', err)
    }
}