from fastapi import  WebSocket
import asyncio
from routers.ws_response_and_status import *

async def generate_full_task(websocket: WebSocket, clients:dict):
    """Генерация полной задачи"""
    task_obj = clients[websocket]["task_obj"]
    
    try:
        # Имитация долгой работы с прогрессом

        await send_response(websocket, command="gen", message="Started generating the task.", status=G_Status.STARTED)

        for i in range(5):
            await asyncio.sleep(1)
            progress = (i + 1) * 20
            await send_response(websocket,
                status=G_Status.PROGRESS,
                command=Commands.GEN,
                message=f"Generating... {progress}%"
            )
        
        # Финальный результат
        clients[websocket]["status"] = "completed"
        clients[websocket]["process"] = None
        
        await send_response(
            websocket, 
            command="gen",
            message="Finished generating the task.",
            status=G_Status.COMPLETED,
            data=task_obj
        )
        
    except asyncio.CancelledError:
        clients[websocket]["status"] = G_Status.CANCELLED
        clients[websocket]["process"] = None
        raise