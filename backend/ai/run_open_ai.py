from openai import OpenAI
import re
import json
from routers.websocket_utils import *
from config import APIKEY, APIURL, OPENROUTER_AI_MODEL

json_pattern = re.compile(r'```json\s*(.*?)\s*```', re.DOTALL)
json_obj_pattern = re.compile(r'\{.*\}', re.DOTALL)

async def run_open_ai(message, websocket, clients, command):
    await send_response(websocket, command=command, message="starting", status=G_Status.STREAM)

    try:
        client = OpenAI(api_key=APIKEY, base_url=APIURL)
        stream = client.chat.completions.create(
            model=OPENROUTER_AI_MODEL,
            messages=[
                # {"role": "system", "content": system_prompt},
                {"role": "user", "content": message},
            ],
            stream=True
        )

        full_response = ""
        token_count = 0
        start_time = time.time()
        last_update_time = start_time

        for chunk in stream:
            current_time = time.time()
            
            # проверка, есть ли контент в чанке
            if chunk.choices[0].delta.content is not None:
                content = chunk.choices[0].delta.content
                full_response += content
                token_count += 1
                
                # каждые 2 секунды отправка прогресса
                if current_time - last_update_time > 2:
                    await send_response(
                        websocket, 
                        command=command,
                        message=str(token_count),
                        status=G_Status.STREAM
                    )
                    last_update_time = current_time
            
            # проверка завершения
            if chunk.choices[0].finish_reason is not None:
                break

    except Exception as e:
        print(f"Error in run_open_ai: {e}")
        await send_error(websocket, command=command, error_message=f"Error in run_open_ai: {e}")
        await forced_stop_of_generation(clients, websocket)
        return None
    
    # валидация JSON
    try:
        # очистка от markdown
        cleaned = clean_json_response(full_response)
        response = json.loads(cleaned)
        print(response)
        return response
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        await send_error(websocket, command=command, message=f"JSON parsing error: {e}")
        await forced_stop_of_generation(clients, websocket)
        return None
    

def clean_json_response(response_text):
    """Извлекает JSON из ответа, игнорируя лишний текст"""
    if not response_text:
        return None
    
    # json блок между ```json и ```
    match = json_pattern.search(response_text)
    
    if match:
        # если найден json в markdown блоке
        return match.group(1).strip()
    
    # если нет markdown блоков, ищется json объект напрямую
    # от первой { до последней }
    match = json_obj_pattern.search(response_text)
    
    if match:
        return match.group(0).strip()
    
    return None

if __name__ == "__main__":
    print(run_open_ai(message="Привет"))