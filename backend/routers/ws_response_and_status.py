from enum import Enum
from fastapi import WebSocket
import time
import json

# === СТАТУСЫ ===

class G_Status(str, Enum):
    # статусы генерации
    STARTED = "generation_started"
    PROGRESS = "generation_progress"
    COMPLETED = "generation_completed"
    CANCELLED = "generation_cancelled"
    ERROR = "generation_error"

    # статусы соединения и обработки запросов
    NOTSET = "task_not_set" # попытка произвести операцию до того, как был предоставлен объект задачи
    ADDED = "task_added" # задача была успешно добавлена
    UNKNOWN = "unknown" # полученное сообщение не понято

class Commands(str, Enum):
    """комманды присылаемые клиентом"""
    SET = 'set' # установить задачу в clients[websocket]["task_obj"], над которой будут производиться операции
    STOP = "stop" # остановить все генерации
    STATUS = "status" # запрос с клиента на статус вполнения задачи (если от сервера ничего не приходит)
    GEN = "gen" # генерация задачи
    GEN_STEPS = "gen_steps" # генерация шагов у задачи
    GEN_MOTIVE = "gen_motive"
    GEN_RISK = "gen_risk"
    GEN_THEME = "gen_theme"
    GEN_STATE = "gen_state"
    GEN_ACTION = "gen_action"
    GEN_STRESS = "gen_stress"

async def send_response(websocket: WebSocket, command: str, message=None, status="success", data=None):
    """Унифицированная отправка ответов"""
    response = {
        "command": command,
        "status": status,
        "timestamp": time.time()
    }
    if message is not None:
        response["message"] = message
    if data is not None:
        response["data"] = data
    await websocket.send_json(response)

async def send_error(websocket:WebSocket, command:str, error_message:str, status:str = G_Status.ERROR):
    await send_response(websocket, command, error_message, status)
