from fastapi import APIRouter, Request, WebSocket, Body
from multiprocessing import Process, Queue
import asyncio
import uuid
import json
from llama_cpp import Llama
from pydantic import BaseModel
from typing import Optional


tasks = {}       # Хранилище задач
websockets = {}  # Храним активные WebSocket-соединения для каждой задачи


router = APIRouter(prefix="/api", tags=["api"])
modelAI = "./gguf/google_gemma-3-12b-it-Q5_K_L.gguf"


class TaskRequest(BaseModel):
    text: str
    description: Optional[str] = ""


def run_llama(prompt, result_queue, task_id):
    try:
        llm = Llama(model_path=modelAI, n_ctx=2000, verbose=False)
        output = llm(prompt, max_tokens=2000, temperature=0.7, top_p=0.9)
        result_queue.put((task_id, output))
    except Exception as e:
        result_queue.put((task_id, {"error": str(e)}))


with open("./routers/mok_subtasks.md", "r") as f:
    promtsubtask = f.read()


@router.post("/generate_subtasks")
async def create_project(request: Request, task_data: TaskRequest = Body(...)):
    task_id = str(uuid.uuid4())
    
    # Используем данные из запроса
    text_task = task_data.text or "Прочитать книгу - Кристен Эллотт, Наташа Дуартен. «Не корми свою тревогу."
    description = task_data.description
    
    # Добавляем описание к промпту, если оно есть
    full_task = f"{text_task}\n{description}" if description else text_task
    prompt = promtsubtask.replace("%%TEXTTASK%%", full_task)

    # Инициализируем задачу
    tasks[task_id] = {"status": "running", "result": None}

    # Запускаем процесс обработки
    result_queue = Queue()
    process = Process(target=run_llama, args=(prompt, result_queue, task_id))
    process.start()

    # Запускаем фоновую задачу для мониторинга процесса
    asyncio.create_task(monitor_task(task_id, process, result_queue, request))

    return {"task_id": task_id, "status": "running"}


async def monitor_task(task_id, process, result_queue, request):
    try:
        # Проверяем отключение клиента и отправляем статус через WebSocket
        while process.is_alive():
            print(f"Monitoring task: {task_id}")
            await asyncio.sleep(1)
            
            if task_id not in websockets or websockets[task_id].client_state.name != "CONNECTED":
                process.terminate()
                tasks[task_id] = {"status": "cancelled", "result": {"message": "Request cancelled due to client disconnection"}}
                await send_websocket_update(task_id)
                return

            # Отправляем промежуточный статус через WebSocket
            await send_websocket_update(task_id)

        # Получаем результат после завершения процесса
        if not result_queue.empty():
            task_id, output = result_queue.get()
            
            # Проверяем наличие ошибки
            if isinstance(output, dict) and "error" in output:
                tasks[task_id] = {"status": "error", "result": {"message": f"Error: {output['error']}", "agent": modelAI}}
            else:
                try:
                    result = json.loads(output["choices"][0]["text"].replace("```json", "").replace("```", "").strip())
                    result["agent"] = modelAI
                    tasks[task_id] = {"status": "completed", "result": result}
                except Exception as e:
                    error_msg = output["choices"][0]["text"] if "choices" in output else str(e)
                    result = {"message": f'error {error_msg}', "agent": modelAI}
                    tasks[task_id] = {"status": "error", "result": result}

            # Отправляем финальный статус через WebSocket
            await send_websocket_update(task_id)
    except Exception as e:
        print(f"Error monitoring task {task_id}: {e}")
        tasks[task_id] = {"status": "error", "result": {"message": f"Server error: {str(e)}", "agent": modelAI}}
        await send_websocket_update(task_id)


async def send_websocket_update(task_id):
    """Отправляет обновления через WebSocket если соединение активно"""
    if task_id in websockets and websockets[task_id]:
        try:
            await websockets[task_id].send_json({
                "task_id": task_id, 
                "status": tasks[task_id]["status"], 
                "result": tasks[task_id]["result"]
            })
        except Exception as e:
            print(f"Error sending to websocket for task {task_id}: {e}")


@router.websocket("/ws/{task_id}")
async def websocket_endpoint(websocket: WebSocket, task_id: str):
    await websocket.accept()
    print(f"WebSocket connection established for task {task_id}")
    
    # Сохраняем соединение
    websockets[task_id] = websocket
    
    # Если задача уже существует, отправляем текущее состояние
    if task_id in tasks:
        await websocket.send_json({
            "task_id": task_id,
            "status": tasks[task_id]["status"],
            "result": tasks[task_id]["result"]
        })
    
    try:
        # Держим соединение открытым и отвечаем на пинги
        while True:
            message = await websocket.receive_text()
            print(f"Received message from client for task {task_id}: {message}")
            # Можно обрабатывать сообщения от клиента, если нужно
    except Exception as e:
        print(f"WebSocket disconnected for task {task_id}: {e}")
    finally:
        # Удаляем соединение при закрытии
        if task_id in websockets:
            del websockets[task_id]
        await websocket.close()