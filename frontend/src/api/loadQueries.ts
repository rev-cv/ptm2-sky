const APIURL = import.meta.env.VITE_API_URL;
import { getDefaultStore, atomQueryList } from '@utils/jotai.store'
import { fetchAuth } from '@api/authFetch'

export async function loadQueries () {

    const store = getDefaultStore()

    fetchAuth(`${APIURL}/api/get_all_queries`, {method: 'POST'})
    .then(res => res.json())
    .then(data => {
        console.log("queries from API:", data)
        store.set(atomQueryList, data.result)
    })
    .catch(err => {
        console.error("Ошибка загрузки фильтров:", err)
    })
}