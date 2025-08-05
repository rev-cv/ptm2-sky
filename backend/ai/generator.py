from fastapi import  WebSocket
import asyncio
from routers.ws_response_and_status import *
from ai.get_promt import get_prompt
from ai.run_open_ai import run_open_ai

async def ai_task_generator (websocket: WebSocket, clients: dict, command):
    try:
        await send_response(
            websocket, 
            command=command, 
            message="Started generating the task.", 
            status=G_Status.STARTED
        )

        task_obj = clients[websocket]["task_obj"]

        promt = get_prompt(task_obj, command)

        if promt is None:
            await send_error(
                websocket, 
                command=command,
                message="Error generating prompt.",
                status=G_Status.ERROR,
            )
            return

        response = run_open_ai(promt)

        # print(response)

        clients[websocket]["process"] = None
        
        await send_response(
            websocket, 
            command=command,
            message="Finished generating the task.",
            status=G_Status.COMPLETED,
            data=response
        )
        
    except asyncio.CancelledError:
        clients[websocket]["process"] = None
        raise