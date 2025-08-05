const APIURL = import.meta.env.VITE_API_URL
const WSURL = import.meta.env.VITE_WS_URL
import { fetchAuth } from '@api/authFetch'
import { TypeViewTask } from '@mytype/typeTask'
import { getDefaultStore, atomGenMotive, atomGenSteps } from '@utils/jotai.store'

export async function generateTask(task: TypeViewTask, typeGen: string): Promise<TypeViewTask | undefined> {
    let wsToken = ""
    try {
        const res = await fetchAuth(`${APIURL}/api/get_ws_token`, { method: 'GET' })
        if (!res.ok) {
            const errText = await res.text()
            throw new Error(`Ошибка получения токена для websocket: ${errText}`)
        }
        const data = await res.json()
        wsToken = data.ws_token
    } catch (err) {
        console.error('Ошибка при получении токена для websocket:', err)
        return undefined
    }

    return new Promise<TypeViewTask | undefined>((resolve, reject) => {
        const ws = new WebSocket(`${WSURL}/ws?ws_token=${wsToken}`)

        ws.onopen = () => {
            console.log("WebSocket connected")
            const message = JSON.stringify({
                command: 'set',
                message: task
            })
            ws.send(message)
        }

        ws.onmessage = (event) => {
            const response = JSON.parse(event.data)
            if (response.status === "task_added") {
                const message = JSON.stringify({ command: typeGen })
                ws.send(message)
            } else if (response.status === "generation_completed" && response.data) {
                ws.close(1000, "The client closed the WebSocket connection.")
                updateState(typeGen)
                resolve(response.data as TypeViewTask)
            }
        }

        ws.onerror = (error) => {
            console.error('WebSocket error:', error)
            reject(error)
        }

        ws.onclose = (event) => {
            console.log(`WebSocket disconnected. Reason: ${event.reason}`)
            if (!event.wasClean) {
                reject(new Error(`WebSocket closed unexpectedly: ${event.reason}`))
            }
        }
    })
}


function updateState (typeGen:string) {
    const store = getDefaultStore()
    switch (typeGen) {
        case "gen_motive":
            store.set(atomGenMotive, prev => {return {...prev, isGen:false}})
            break
        case "gen_steps":
            store.set(atomGenSteps, prev => {return {...prev, isGen:false}})
            break
        default:
            break
    }
}