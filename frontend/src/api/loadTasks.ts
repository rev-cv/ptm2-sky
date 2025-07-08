const APIURL = import.meta.env.VITE_API_URL
import { getDefaultStore, searchRequest, searchRequestID, viewTasks, samplingStatus } from '@utils/jotai.store'
import { searchRequestSchema } from '@mytype/typeSearchAndFilter'

export const loadTasks = async (isSubstitution=false) => {
    const store = getDefaultStore()

    // очистка текущих отображаемых задач, если это не запрос для пагинации

    if (isSubstitution) {
        store.set(viewTasks, [])
    }

    // получение данных для запроса

    const fillingRequest = store.get(searchRequest)

    const parseResult = searchRequestSchema.safeParse(fillingRequest)
    if (!parseResult.success) {
        store.set(samplingStatus, 'error')
        console.error('Ошибка валидации данных поиска:', parseResult.error.format());
        alert('Некорректные данные поиска!')
        return;
    }

    // инициализация запроса и обработка результата

    store.set(samplingStatus, 'loading')

    try {
        const res = await fetch(`${APIURL}/api/search_tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ...fillingRequest,
                filters: store.get(searchRequestID)
            })
        })
        if (!res.ok) throw new Error('Ошибка поиска')
        const data = await res.json()

        store.set(viewTasks, data.result)
        store.set(samplingStatus, 'success')
    } catch (err) {
        store.set(samplingStatus, 'error')
        console.error('Ошибка поиска задач:', err)
    }
};