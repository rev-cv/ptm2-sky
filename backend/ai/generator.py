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

        print(promt)

        if promt is None:
            await send_error(
                websocket, 
                command=command,
                message="Error generating prompt.",
                status=G_Status.ERROR,
            )
            return

        response = run_open_ai(promt)

        if command == Commands.GEN_STEPS:
            checked_result = check_steps(response)
            if checked_result:
                response = checked_result
        elif command == Commands.GEN_RISK:
            response = check_risk(response)

        if response is None:
            send_error(
                command=Commands.GEN_STEPS,
                error_message="От AI не получен валидный ответ.",
                status=G_Status.ERROR
            )

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


def check_steps(response):
    
    subtasks = response.get("subtasks")

    if not subtasks:
        send_error(
            command=Commands.GEN_STEPS,
            error_message="От AI получен не валидный ответ.",
            status=G_Status.ERROR
        )
        return None

    checked_result = []

    for i, s in enumerate(subtasks):
        checked_result.append({
            "id": (i + 1) * -1,
            "status": False,
            "title": s.get("title", ""),
            "description": s.get("description", ""),
            "continuance": s.get("continuance", 0),
            "instruction": s.get("instruction", ""),
            "motivation": s.get("motivation", ""),
            "order": s.get("order", 0),
        })
    
    return {"subtasks": checked_result}

def check_risk(response):

    risk = response.get("risk", 0)
    risk_explanation = response.get("risk_explanation", "")
    risk_proposals = response.get("risk_proposals", "")
    
    return {
        "risk": risk,
        "risk_explanation": risk_explanation,
        "risk_proposals": risk_proposals,
    }
    