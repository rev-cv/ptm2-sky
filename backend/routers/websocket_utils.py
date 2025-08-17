from enum import Enum
from fastapi import WebSocket
import time
import json
import asyncio

# === СТАТУСЫ ===

class G_Status(str, Enum):
    # статусы генерации
    STARTED = "generation_started"
    PROGRESS = "generation_progress"
    COMPLETED = "generation_completed"
    CANCELLED = "generation_cancelled"
    ERROR = "generation_error"
    TERMINATE = "forced_to_terminate"
    STREAM = "stream"

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


async def forced_stop_of_generation(clients, websocket):
    if websocket not in clients:
        return
    if "process" not in clients[websocket] or clients[websocket]["process"] is None:
        del clients[websocket]
        return
    
    task = clients[websocket]["process"]
    task.cancel()

    try:
        await task
    except asyncio.CancelledError:
        print(f"Задача для {websocket} завершена по требованию пользователя.")
        # закрыть соединение
        if websocket.client_is_connected:
            await websocket.close(code=1000)
        clients.pop(websocket, None)


def task_object_data_encapsulation(task_obj):
    """Добавление данных к объекту задачи, который отправится в качестве промта"""
    encapsulation_data = {
        'stress': [
            "влияние стресса на выполнение задачи не определено",
            "задача вызывает беспокойство, не мешающее выполнению",
            "задача вызывает напряжение, которое отвлекает от выполнения",
            "задача вызывает сильный стресс"
        ], 
        'apathy': [
            "эмоциональное состояние не влияет на выполнение задачи или влияние не определено",
            "задача не вызывает особого интереса, но это не мешает выполнению",
            "усталость от задачи, сложно сосредоточиться, но еще можно работать",
            "задача вызывает отторжение и неприятие"
        ], 
        'meditative': [
            "на задаче легко сконцентрироваться, возможно погрузиться в состояние потока",
            "задача в целом не требует усилий для поддержания концентрации",
            "задача вызывает трудности с концентрацией",
            "на задаче сложно сконцентрироваться, мысли рабегаются"
        ], 
        'comfort': [
            "рабочий процесс настроен и задача выполняется легко и приятно",
            "в рабочем процессе есть небольшие неудобства, но они не мешают выполнению задачи",
            "есть сложности с организацией рабочего процесса, но всё ещё можно работать",
            "рабочий процесс вызывает сильный дискомфорт и мешает работе"
        ], 
        'automaticity': [
            "что-то подобное многократно делалось ранее",
            "что-то подобное делалось ранее, но не в таком объёме или сложности",
            "задача новая, в сфере в которой недостаточно опыта",
            "ничего подобного раньше не делалось, поэтому необходимо продумывать и направлять каждый свой шаг"
        ], 
        'significance': [
            "задача полностью соответствует личным ценностям и убеждениям",
            "задача частично соответствует личным ценностям, но есть отдельные моменты вызывающие сомнения",
            "задача вызывает беспокойство и сомнения по поводу соответствия ценностям",
            "задача полностью противоречит личным ценностям и убеждениям"
        ],
        'physical': [
            "физическая нагрузка отсутствует",
            "физическая нагрузка минимальная",
            "физическая нагрузка умеренная",
            "физическая нагрузка тяжелая"
        ],
        'intellectual': [
            "интеллектуальная нагрузка отсутствует",
            "интеллектуальная нагрузка минимальная",
            "интеллектуальная нагрузка умеренная",
            "интеллектуальная нагрузка тяжелая"
        ], 
        'motivational': [
            "мотивация высокая",
            "мотивация умеренная",
            "мотивация низкая",
            "мотивация отсутствует"
        ], 
        'emotional': [
            "эмоциональная нагрузка отсутствует",
            "эмоциональная нагрузка минимальная",
            "эмоциональная нагрузка умеренная",
            "эмоциональная нагрузка тяжелая"
        ], 
        'financial': [
            "выполнение задачи не требует привлечения финансов",
            "выполнение задачи требует привлечение финансов до 5% от дохода",
            "выполнение задачи требует привлечение финансов до 20% от дохода",
            "выполнение задачи требует привлечение финансов более 20% от дохода"
        ],
        'social': [
            "задача выполняется в одиночестве",
            "задача требует неформального и рутинного общения с 1 человеком и минимум эмоциональной вовлечённости",
            "задача требует общение с группой или формальные переговоры, требуется адаптация под собеседника",
            "задача требует публичности, риск конфликта/оценки"
        ], 
        'temporal': [
            "задача требует до 30 мин",
            "задача требует несколько часов",
            "задача требует дня или более",
            "задача требует неделю или больше"
        ]
    }

    for key, options in encapsulation_data.items():
        if key in task_obj and isinstance(task_obj[key], int):
            if 0 <= task_obj[key] < len(options):
                task_obj[key] = options[task_obj[key]]
            # Можно добавить else для обработки неверных индексов, если нужно

    return task_obj