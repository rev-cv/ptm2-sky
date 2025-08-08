from enum import Enum
from fastapi import WebSocket
import time
import json

# === СТАТУСЫ ===

class C_Status(str, Enum):
    """статусы соединения и обработки запросов"""
    UNKNOWN = "unknown" # полученное сообщение не понято


class T_Status(str, Enum):
    """статусы задач"""
    NOTSET = "task_not_set" # попытка выполнить 
    ADDED = "task_added"

class G_Status(str, Enum):
    """статусы генерации"""
    STARTED = "generation_started"
    PROGRESS = "generation_progress"
    COMPLETED = "generation_completed"
    CANCELLED = "generation_cancelled"
    ERROR = "generation_error"

class Commands(str, Enum):
    SET = 'set' # установить задачу в clients[websocket]["task_obj"], над которой будут производиться операции
    STATUS = "status" # запрос с клиента на статус вполнения задачи (если от сервера ничего не приходит)
    GEN = "gen" # генерация задачи
    GEN_STEPS = "gen_steps" # генерация шагов у задачи
    GEN_MOTIVE = "gen_motive"
    GEN_RISK = "gen_risk"

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

async def send_error(websocket:WebSocket, command:str, error_message:str, status:str = "error"):
    await send_response(websocket, command, error_message, status)
