const APIURL = import.meta.env.VITE_API_URL;
import { getDefaultStore, atomFilterList } from '@utils/jotai.store'

export async function loadFilters () {

    const store = getDefaultStore()

    fetch(`${APIURL}/api/get_all_filters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(res => res.json())
    .then(data => {
        // console.log("filters from API:", data)
        store.set(atomFilterList, data.result)
    })
    .catch(err => {
        console.error("Ошибка загрузки фильтров:", err)
    })
}