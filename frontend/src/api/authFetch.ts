export async function fetchAuth(input: RequestInfo, init: RequestInit = {}): Promise<Response> {

    const config: RequestInit = {
        credentials: 'include',
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...(init.headers || {})
        }
    }

    // основной запрос
    let response = await fetch(input, config)

    if (response.status !== 401) {
        return response
    }

    // попробовать refresh токен
    console.log("попробовать refresh токен")
    const refreshResponse = await fetch('/api/refresh', {
        method: 'POST',
        credentials: 'include',
    })

    if (!refreshResponse.ok) {
        return response
    }

    // Повторный запрос с новыми токенами
    response = await fetch(input, config)
    return response
}
