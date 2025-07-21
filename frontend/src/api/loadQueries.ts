const APIURL = import.meta.env.VITE_API_URL;
import { getDefaultStore, atomQueryList } from '@utils/jotai.store'

export async function loadQueries () {

    const store = getDefaultStore()

    window.addEventListener('load', () => {
        fetch(`${APIURL}/api/get_query_all`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(res => res.json())
        .then(data => {
            console.log("queries from API:", data)
            store.set(atomQueryList, data.list_queries)
        })
        .catch(err => {
            console.error("Ошибка загрузки фильтров:", err)
        })
    })
}