from fastapi import APIRouter, Request, WebSocket, Body, Depends
from multiprocessing import Process, Queue
import asyncio
import uuid
import json
from llama_cpp import Llama
from openai import OpenAI
from sqlalchemy.orm import Session

from database.sqlalchemy_tables import get_db
from database.db_get_all_filters import get_completed_promt

# from schemas.types_new_task import TaskGenerateRequest

from routers.filter_router import router as filter_router
from routers.task_router import router as task_router
from routers.query_router import router as query_router
from routers.auth_router import router as auth_router

tasks = {}       # Хранилище задач
websockets = {}  # Храним активные WebSocket-соединения для каждой задачи

router = APIRouter(prefix="/api", tags=["api"])
router.include_router(auth_router)
router.include_router(filter_router)
router.include_router(task_router)
router.include_router(query_router)


with open("./ai_promts/APIKEY", "r") as f:
    APIKEY = f.read()

with open("./ai_promts/APIURL", "r") as f:
    APIURL = f.read()

with open("./ai_promts/magic_task_promt.md", "r") as f:
    magic_task_promt = f.read()


# def run_llama(prompt, result_queue, task_id):
#     try:
#         llm = Llama(model_path="./gguf/google_gemma-3-12b-it-Q5_K_L.gguf", n_ctx=2000, verbose=False)
#         output = llm(prompt, max_tokens=2000, temperature=0.7, top_p=0.9)
#         result_queue.put((task_id, output))
#     except Exception as e:
#         result_queue.put((task_id, {"error": str(e)}))


# def run_open_ai(system_prompt, message, result_queue, task_id):
#     try:
#         client = OpenAI(api_key=APIKEY, base_url=APIURL)
#         response = client.chat.completions.create(
#             model="google/gemma-3-27b-it:free",
#             messages=[
#                 {"role": "system", "content": system_prompt},
#                 {"role": "user", "content": message},
#             ],
#             stream=False
#         )
#         result_queue.put((task_id, response.choices[0].message.content))
#         print(response.choices[0].message.content)
#     except Exception as e:
#         result_queue.put((task_id, {"error": str(e)}))


# def mok_run_open_ai(system_prompt, message, result_queue, task_id):
#     with open("./ai_promts/mok_result.json", "r") as f:
#         mok = f'```json\n{f.read()}\n```'
#     result_queue.put((task_id, mok))


# @router.post("/generate_options_for_task")
# async def generate_options_for_task(
#     request: Request, 
#     task_data: TaskGenerateRequest = Body(...),
#     db: Session = Depends(get_db)
#     ):
#     task_id = str(uuid.uuid4())
    
#     # --- данные из запроса ---
#     text_task = task_data.text
#     description = task_data.description
    
#     message = f"{text_task}\n{description}" if description else text_task

#     # --- инициализация задачи ---
#     tasks[task_id] = {"status": "running", "result": None}

#     # --- заполнение промта фильтрами для AI ---
#     update_promt = get_completed_promt(magic_task_promt, db)

#     # --- запуск процесса обработки ---
#     result_queue = Queue()
#     # process = Process(target=run_llama, args=(prompt, result_queue, task_id))
#     process = Process(
#         target=mok_run_open_ai, 
#         args=(update_promt, message, result_queue, task_id)
#     )
#     process.start()

#     # --- запуск фоновой задачи для мониторинга процесса ---
#     asyncio.create_task(monitor_task(task_id, process, result_queue, request))

#     return {"task_id": task_id, "status": "running"}


# async def monitor_task(task_id, process, result_queue, request):
#     try:
#         # проверка статуса подключения клиента и отправка статуса через WebSocket
#         while process.is_alive():
#             # print(f"Monitoring task: {task_id}")
#             await asyncio.sleep(1)
            
#             if task_id not in websockets or websockets[task_id].client_state.name != "CONNECTED":
#                 process.terminate()
#                 tasks[task_id] = {
#                     "status": "cancelled", 
#                     "result": {
#                         "message": "Request cancelled due to client disconnection"
#                     }
#                 }
#                 await send_websocket_update(task_id)
#                 return

#             # отправка промежуточного статуса через WebSocket
#             await send_websocket_update(task_id)

#         # получение результата после завершения процесса
#         if not result_queue.empty():
#             task_id, output = result_queue.get()
            
#             # проверка на наличие ошибки
#             if isinstance(output, dict) and "error" in output:
#                 tasks[task_id] = {"status": "error", "result": {"message": f"Error: {output['error']}"}}
#             else:
#                 try:
#                     result = json.loads(output.replace("```json", "").replace("```", "").strip())
#                     tasks[task_id] = {"status": "completed", "result": result}
#                 except Exception as e:
#                     result = {"message": f'error {str(e)}'}
#                     tasks[task_id] = {"status": "error", "result": result}

#             # отправка финального статуса через WebSocket
#             await send_websocket_update(task_id)
#     except Exception as e:
#         print(f"Error monitoring task {task_id}: {e}")
#         tasks[task_id] = {"status": "error", "result": {"message": f"Server error: {str(e)}"}}
#         await send_websocket_update(task_id)


# async def send_websocket_update(task_id):
#     """Отправляет обновления через WebSocket если соединение активно"""
#     if task_id in websockets and websockets[task_id]:
#         try:
#             await websockets[task_id].send_json({
#                 "task_id": task_id, 
#                 "status": tasks[task_id]["status"], 
#                 "result": tasks[task_id]["result"]
#             })
#         except Exception as e:
#             print(f"Error sending to websocket for task {task_id}: {e}")


# @router.websocket("/ws/{task_id}")
# async def websocket_endpoint(websocket: WebSocket, task_id: str):
#     await websocket.accept()
#     print(f"WebSocket connection established for task {task_id}")
#     websockets[task_id] = websocket

#     if task_id in tasks:
#         await websocket.send_json({
#             "task_id": task_id,
#             "status": tasks[task_id]["status"],
#             "result": tasks[task_id]["result"]
#         })

#     try:
#         while True:
#             message = await websocket.receive_text()
#             print(f"Received message from client for task {task_id}: {message}")
#     except Exception as e:
#         print(f"WebSocket disconnected for task {task_id}: {e}")
#     finally:
#         if task_id in websockets:
#             del websockets[task_id]
