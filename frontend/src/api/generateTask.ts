const APIURL = import.meta.env.VITE_API_URL
const WSURL = import.meta.env.VITE_WS_URL
import { fetchAuth } from '@api/authFetch'
import { TypeViewTask } from '@mytype/typeTask'

export async function generateTask (task:TypeViewTask, typeGen:string) {

    let wsToken = ""

    try {
        const res = await fetchAuth(`${APIURL}/api/get_ws_token`, {method: 'GET'})
        // из-за проблем с передачей куки по websocket
        // было принято решение получать короткоживущий токен (60сек)
        // конкретно для открытия соединения websocket
        
        if (!res.ok) {
            const errText = await res.text()
            throw new Error(`Ошибка получения токена для websocket: ${errText}`)
        }

        const data = await res.json()
        wsToken = data.ws_token

    } catch (err) {
        console.error('Ошибка при получении токена для websocket:', err)
        return
    }

    const ws = new WebSocket(`${WSURL}/ws?ws_token=${wsToken}`)

    ws.onopen = () => {
        console.log("WebSocket connected")
        const message = JSON.stringify({
            "command": 'set',
            "message": task
        })
        ws.send(message)
    }

    ws.onmessage = (event) => {
        // обработка сообщений присылаемых сервером
        const response = JSON.parse(event.data)
        console.log(response)

        switch (response.status) {
            case "task_added":
                // задача загружена => можно подать команду на старт генерации
                const message = JSON.stringify({"command": typeGen})
                ws.send(message)
                console.log(response.status)
                break
            case "gen":

                break
            default:
                break
        }
    }

    ws.onclose = (event) => {
        console.log(`WebSocket disconnected. Reason: ${event}`)
    }

    const closeWS = () => {
        ws.close(1000, "The client closed the WebSocket connection.")
    }
}
