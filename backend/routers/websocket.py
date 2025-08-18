from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from typing import Optional
from routers.auth_router import unpack_token
import asyncio
import json
from ai.generator import ai_task_generator
from routers.websocket_utils import *

# Хранилище активных клиентов
clients = {}

router = APIRouter()

@router.websocket("/ws")
async def websocket_connection(websocket: WebSocket, ws_token: Optional[str] = Query(None)):
    """Установка websocket соединения с клиентом"""

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

            await send_response(websocket, command=command, message="initialization", status=G_Status.STREAM)

            await connection_processing(websocket, command, payload, user_id)

    except WebSocketDisconnect:
        # разрыв соединения: прекратить все генерации и очистить информацию о сессии
        await forced_stop_of_generation(clients, websocket)
        print("Клиент отключился")


async def connection_processing(websocket: WebSocket, command:str, payload:str|None, user_id):
    """Обработка сообщений присылаемых клиентом"""

    match command:
        case Commands.SET:
            clients[websocket]["task_obj"] = task_object_data_encapsulation(payload)
            await send_response(websocket, Commands.SET, "The task object was loaded successfully.", G_Status.ADDED)
        case cmd if cmd in {
            Commands.GEN,
            Commands.GEN_STEPS,
            Commands.GEN_RISK,
            Commands.GEN_THEME,
            Commands.GEN_ACTION,
            Commands.GEN_INTENSITY,
        }:
            # проверка, есть ли уже запущенный процесс
            if clients[websocket]["process"] is not None:
                await send_error(
                    websocket,
                    command=command,
                    error_message="Generation already in progress. Use 'cancel' to stop it.",
                    status=G_Status.PROGRESS
                )
                return
            # проверка, сначала должен быть передан объек задачи
            if not clients[websocket]["task_obj"]:
                await send_error(
                    websocket,
                    command=command,
                    error_message="No task object set. Use 'set' command first.",
                    status=G_Status.NOTSET
                )
                return

            # запуск генерации в фоне
            clients[websocket]["process"] = asyncio.create_task(
                ai_task_generator(websocket, clients, command, user_id)
            )
        # case Commands.STOP:
        #     # впринципе это не нужно, т.к. пользователю достаточно разорвать соединение
        #     await forced_stop_of_generation(clients, websocket)
        case _:
            await send_error(websocket, command, f"Unknown command: {command}", G_Status.UNKNOWN)
