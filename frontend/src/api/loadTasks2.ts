const APIURL = import.meta.env.VITE_API_URL
import { getDefaultStore, atomQuerySelect, viewTasks, samplingStatus } from '@utils/jotai.store'
import { fetchAuth } from '@api/authFetch'

export const loadTasks = async (isSubstitution=false) => {
    const store = getDefaultStore()

    // очистка текущих отображаемых задач, если это не запрос для пагинации
    if (isSubstitution) {
        store.set(viewTasks, [])
    }

    // все даты в базе данных хранятся в UTC
    // при этом если в запросе имеются относительные указания даты
    // то необходимо иметь представление о реальном времени у пользователя
    const offsetMinutes = new Date().getTimezoneOffset()

    const body = store.get(atomQuerySelect)

    // инициализация запроса и обработка результата
    store.set(samplingStatus, 'loading')

    try {
        const res = await fetchAuth(`${APIURL}/api/get_tasks`, {
            method: 'POST',
            body: JSON.stringify({...body, tz: offsetMinutes})
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