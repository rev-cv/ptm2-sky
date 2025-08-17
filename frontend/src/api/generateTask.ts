const APIURL = import.meta.env.VITE_API_URL
const WSURL = import.meta.env.VITE_WS_URL

import { getDefaultStore, atomGenMotive, atomGenSteps, atomGenTaskBuffer,
    atomGenRisk, atomGenTheme, addToast, startToastGen, stopToastGen, atomGenAction } from '@utils/jotai.store'
import { fetchAuth } from '@api/authFetch'
import { TypeViewTask } from '@mytype/typeTask'
import { Commands, G_Status, CommandValues } from '@mytype/typesGen'

let ws:WebSocket|null = null
const store = getDefaultStore()

export async function wsCommander(command: CommandValues, task: TypeViewTask) : Promise<TypeViewTask | undefined> {

    console.log(command)
    
    // комманда на закрытие веб соединения
    if (ws && ws.readyState === WebSocket.OPEN && command === Commands.STOP) {
        // ws?.send(JSON.stringify({command}))
        ws?.close(1000, "Stopped by client")
        ws = null
        addToast("Генерация отменена!", "delete")
        console.log(`WebSocket disconnected. Reason: Stopped by client.`)
        return
    }
    
    // проверка на активную генерацию
    if (ws && ws.readyState === WebSocket.OPEN) {
        resetGen(command)
        addToast("Генерация уже запущена!", "delete")
        console.log("Генерация уже запущена. Дождитесь окончания.")
        return
    }

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
        ws = new WebSocket(`${WSURL}/ws?ws_token=${wsToken}`)

        ws.onopen = () => {
            console.log("WebSocket connected")
            const message = JSON.stringify({
                command: Commands.SET,
                message: task
            })
            ws?.send(message)
        }

        ws.onmessage = (event) => {
            const response = JSON.parse(event.data)
            if (response.status === G_Status.ADDED) {
                const message = JSON.stringify({command})
                ws?.send(message)
            } else if (response.status === G_Status.STREAM) {
                // console.log(response.message)
                startToastGen(response.message)
            } else if (response.status === G_Status.ERROR) {
                addToast(response.message, "delete")
                resetGen(command)
                ws?.close(1000)
            } else if (response.status === G_Status.COMPLETED && response.data) {
                ws?.close(1000, "The client closed the WebSocket connection.")

                // ↓ вставка данных в буфер обмена
                const buffer = store.get(atomGenTaskBuffer)
                const bufferElement = buffer[task.id] ?? {}
                store.set(atomGenTaskBuffer, prev => ({...prev, [task.id]: {...bufferElement, ...response.data} }) )
                
                updateGen(command)
                addToast("Генерация завершена")
                stopToastGen()
                resolve(response.data as TypeViewTask)
            }
        }

        ws.onerror = (error) => {
            // onerror на клиенте вызывается браузером при ошибках низкого уровня
            // например, при проблемах с сетью или протоколом
            console.error('WebSocket browser error:', error)
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


function updateGen (command:CommandValues) {
    switch (command) {
        case Commands.GEN_MOTIVE:
            store.set(atomGenMotive, prev => ({...prev, isGen:false}))
            break
        case Commands.GEN_STEPS:
            store.set(atomGenSteps, prev => ({...prev, isGen:false}))
            break
        case Commands.GEN_RISK:
            store.set(atomGenRisk, prev => ({...prev, isGen:false}))
            break
        case Commands.GEN_THEME:
            store.set(atomGenTheme, prev => ({...prev, isGen:false}))
            break
        case Commands.GEN_ACTION:
            store.set(atomGenAction, prev => ({...prev, isGen:false}))
            break
        default:
            break
    }
}

function resetGen (command:CommandValues) {
    switch (command) {
        case Commands.GEN_MOTIVE:
            store.set(atomGenMotive, {fixed:"", isGen:false})
            break
        case Commands.GEN_STEPS:
            store.set(atomGenSteps, {fixed:[], isGen:false})
            break
        case Commands.GEN_RISK:
            store.set(atomGenRisk, {fixed:{risk:0, risk_explanation:"", risk_proposals:""}, isGen:false})
            break
        case Commands.GEN_THEME:
            store.set(atomGenTheme, {fixed:[], isGen:false})
            break
        case Commands.GEN_ACTION:
            store.set(atomGenAction, {fixed:[], isGen:false})
            break
        default:
            break
    }
}

