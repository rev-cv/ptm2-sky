const APIURL = import.meta.env.VITE_API_URL
import { atomIsAuthenticated, getDefaultStore } from '@utils/jotai.store'
import { fetchAuth } from '@api/authFetch'

export const checkToken = async () => {

    const store = getDefaultStore()

    try {
        const response = await fetchAuth(`${APIURL}/api/check-token`, {
            method: 'GET',
            credentials: 'include',
        })

        if (response.status === 401 || !response.ok) {
            store.set(atomIsAuthenticated, false)
            throw new Error('Token check failed')
        }
        const data = await response.json()
        store.set(atomIsAuthenticated, data.valid)
    } catch (error) {
        store.set(atomIsAuthenticated, false)
    }
}