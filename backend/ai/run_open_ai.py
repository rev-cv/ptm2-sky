import requests
import time
import re
import json
from routers.websocket_utils import *
from config import APIKEY, APIURL, OPENROUTER_AI_MODEL

json_pattern = re.compile(r'```json\s*(.*?)\s*```', re.DOTALL)
json_obj_pattern = re.compile(r'\{.*\}', re.DOTALL)

async def run_open_ai(message, websocket, clients, command):
    await send_response(websocket, command=command, message="starting", status=G_Status.STREAM)
    
    headers = {
        "Authorization": f"Bearer {APIKEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost",
        "X-Title": "Web Application"
    }
    
    data = {
        "model": OPENROUTER_AI_MODEL,
        "messages": [{"role": "user", "content": message}],
        "stream": True
    }
    
    full_response = ""
    token_count = 0
    start_time = time.time()
    last_update_time = start_time

    try:
        print(f"Sending request to OpenRouter: {APIURL}/chat/completions")
        
        response = requests.post(
            f"{APIURL}/chat/completions",
            headers=headers,
            json=data,
            stream=True,
            timeout=30
        )
        
        if response.status_code != 200:
            error_msg = f"API Error: {response.status_code} - {response.text}"
            print(error_msg)
            await send_error(websocket, command=command, error_message=error_msg)
            await forced_stop_of_generation(clients, websocket)
            return None
        
        print("Stream started successfully")

        for line in response.iter_lines():
            current_time = time.time()
            
            if line:
                line_text = line.decode('utf-8')
                if line_text.startswith('data: '):
                    data_str = line_text[6:]  # Remove "data: " prefix
                    
                    if data_str == '[DONE]':
                        break
                    
                    try:
                        chunk = json.loads(data_str)
                        if 'choices' in chunk and chunk['choices']:
                            content = chunk['choices'][0].get('delta', {}).get('content', '')
                            if content:
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
                    
                    except json.JSONDecodeError:
                        continue

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
        print(f"Parsed response: {response}")
        return response
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        print(f"Raw response: {full_response}")
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