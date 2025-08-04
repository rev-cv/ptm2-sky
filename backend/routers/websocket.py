from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from typing import Optional
from routers.auth_router import unpack_token
import asyncio
import json
from ai_gen.full_task import generate_full_task
from routers.ws_response_and_status import *

# Хранилище активных клиентов
clients = {}

router = APIRouter()

@router.websocket("/ws")
async def websocket_connection(websocket: WebSocket, ws_token: Optional[str] = Query(None)):
    """Установка websocket соединения с клиентом"""

    print("*"*30)
    print(ws_token)
    print("*"*30)

    # проверки доступа на основе специально сгенерированного токена
    if not ws_token:
        await websocket.close(code=4001, reason="No access token")
        return
    
    user_id = unpack_token(ws_token, "a", True)

    if not user_id:
        await websocket.close(code=4001, reason="Invalid or expired token")
        return
    
    # соединение принимается
    await websocket.accept()
    
    clients[websocket] = {
        "user_id": user_id,
        "task_obj": None,
        "process": None,
    }
    
    """
    Открытое соединение всегда принимает json состоящий из двух полей

    - command - что делать
        - set - задает объект задачи
        - gen - сгенерировать всю задачу
        - gen_steps - сгенерировать шаги
        - gen_motivation
        - status - отслеживание состояния при генерациях
    - message - над чем произволить действие (не обязательное поле)
    """

    try:
        while True: # цикл ожидания сообщений
            try:
                raw_data = await websocket.receive_text()
                message = json.loads(raw_data)

                # валидация структуры сообщения
                if not isinstance(message, dict) or "command" not in message:
                    await send_error(websocket, "validation", "Invalid message format. Expected: {\"command\": \"...\", \"message\": \"...\"}")
                    continue
                    
                command = message["command"]
                payload = message.get("message", None)

            except json.JSONDecodeError:
                await send_error(websocket, "parse", "Invalid JSON format")

            await connection_processing(websocket, command, payload)

    except WebSocketDisconnect:
        clients.pop(websocket, None)
        print("Клиент отключился")


async def connection_processing(websocket: WebSocket, command:str, payload:str|None):
    """Обработка сообщений присылаемых клиентом"""

    print("-"*30)
    print(command)
    print("-"*30)

    match command:
        case Commands.SET:
            clients[websocket]["task_obj"] = payload


            print("*"*30)
            print(payload)
            print("*"*30)
            clients[websocket]["status"] = Commands.STATUS
            await send_response(websocket, "set", "The task object was loaded successfully.", T_Status.ADDED)
        case Commands.STATUS:
            await websocket.send_text(clients[websocket]["status"])
        case Commands.GEN:
            # проверка, есть ли уже запущенный процесс
            if clients[websocket]["process"] is not None:
                await send_error(
                    websocket, 
                    command="gen", 
                    error_message="Generation already in progress. Use 'cancel' to stop it.", 
                    status=G_Status.PROGRESS
                )
                return
            # проверка, сначала должен быть передан объек задачи
            if not clients[websocket]["task_obj"]:
                await send_error(
                    websocket, 
                    command="gen", 
                    error_message="No task object set. Use 'set' command first.", 
                    status=T_Status.NOTSET
                )
                return
            
            # запуск генерации в фоне
            clients[websocket]["status"] = "generating"
            clients[websocket]["process"] = asyncio.create_task(
                generate_full_task(websocket, clients)
            )

            

            
        case _:
            await send_error(websocket, command, f"Unknown command: {command}", C_Status.UNKNOWN)



