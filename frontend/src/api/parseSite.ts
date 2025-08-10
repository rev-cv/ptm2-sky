const APIURL = import.meta.env.VITE_API_URL;
import { fetchAuth } from '@api/authFetch'

export async function parseSite(url: string) {
    try {
        const res = await fetchAuth(`${APIURL}/api/metadata?url=${encodeURIComponent(url)}`, { method: 'GET' });
        if (!res.ok) {
            return { data: null, error: `HTTP error! Status: ${res.status}` };
        }
        const data = await res.json();
        return { data, error: null };
    } catch (err) {
        console.error("Ошибка fetch:", err);
        return { data: null, error: err };
    }
}