const APIURL = import.meta.env.VITE_API_URL
import { getDefaultStore, atomQuerySelect, atomViewTasks, atomViewTasksPage, atomViewTasksAllCount, atomSamplingStatus } from '@utils/jotai.store'
import { fetchAuth } from '@api/authFetch'

let isLoading = false;
// ↑ глобальный флаг внутри модуля
// защита от двойного вызова StrictMode
// предотвращает гонки и повторную загрузку

export const loadTasks = async (isSubstitution=true) => {
    if (isLoading) return; // предотвращение повторного вызова
    isLoading = true;

    const store = getDefaultStore()

    let page;

    // очистка текущих отображаемых задач, если это не запрос для пагинации
    if (isSubstitution) {
        store.set(atomViewTasks, [])
        page = 1
    } else {
        page = store.get(atomViewTasksPage) + 1
        // ↑ вызов с isSubstitution===true предполагает, что нужна следующая страница
    }

    store.set(atomViewTasksPage, page)

    // все даты в базе данных хранятся в UTC
    // при этом если в запросе имеются относительные указания даты
    // то необходимо иметь представление о реальном времени у пользователя
    const offsetMinutes = new Date().getTimezoneOffset()

    const body = store.get(atomQuerySelect)

    // инициализация запроса и обработка результата
    store.set(atomSamplingStatus, 'loading')

    try {
        const res = await fetchAuth(`${APIURL}/api/get_tasks`, {
            method: 'POST',
            body: JSON.stringify({...body, tz: offsetMinutes, page})
        })
        
        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Ошибка поиска: ${errText}`);
        }

        const data = await res.json()

        store.set(atomViewTasks, prev => [...prev, ...data.result])
        store.set(atomViewTasksAllCount, data.count)
        store.set(atomSamplingStatus, 'success')

    } catch (err) {
        store.set(atomSamplingStatus, 'error')
        console.error('Ошибка поиска задач:', err)
    } finally {
        isLoading = false;
    }
}