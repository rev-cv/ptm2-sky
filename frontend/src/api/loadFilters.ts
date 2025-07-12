const APIURL = import.meta.env.VITE_API_URL;
import { getDefaultStore, filterFromServer } from '@utils/jotai.store'

export function loadFilters () {

    const store = getDefaultStore()

    window.addEventListener('load', () => {
        fetch(`${APIURL}/api/get_filters`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(data => {
            console.log("filters from API:", data)
            store.set(filterFromServer, data)
        })
        .catch(err => {
            console.error("Ошибка загрузки фильтров:", err)
        })
    })
}