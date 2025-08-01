const APIURL = import.meta.env.VITE_API_URL;
import { getDefaultStore, atomFilterList } from '@utils/jotai.store'
import { fetchAuth } from '@api/authFetch'

export async function loadFilters () {

    const store = getDefaultStore()

    fetchAuth(`${APIURL}/api/get_all_filters`, {method: 'POST'})
    .then(res => res.json())
    .then(data => {
        store.set(atomFilterList, data.result)
    })
    .catch(err => {
        console.error("Ошибка загрузки фильтров:", err)
    })
}