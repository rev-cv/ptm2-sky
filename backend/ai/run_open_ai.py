from dotenv import load_dotenv
import os
from openai import OpenAI
import re
import json
from routers.ws_response_and_status import *

load_dotenv()

APIKEY = os.getenv("OPENROUTER_AI_KEY")
APIURL = os.getenv("OPENROUTER_AI_URL")

json_pattern = re.compile(r'```json\s*(.*?)\s*```', re.DOTALL)
json_obj_pattern = re.compile(r'\{.*\}', re.DOTALL)

async def run_open_ai(message, websocket, command):
    try:
        client = OpenAI(api_key=APIKEY, base_url=APIURL)
        stream = client.chat.completions.create(
            # model="google/gemma-3-27b-it:free",
            model="deepseek/deepseek-r1-0528:free",
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
            
            # Проверяем, есть ли контент в чанке
            if chunk.choices[0].delta.content is not None:
                content = chunk.choices[0].delta.content
                full_response += content
                token_count += 1
                
                # Выводим новые токены
                # print(content, end='', flush=True)
                
                # Каждые 2 секунды показываем статистику
                if current_time - last_update_time > 2:
                    elapsed = current_time - start_time
                    tokens_per_sec = token_count / elapsed if elapsed > 0 else 0
                    # print(f"\n[📊 Статус: {token_count} токенов, {tokens_per_sec:.1f} токен/сек, {elapsed:.1f}сек]")
                    await send_response(
                        websocket, 
                        command=command,
                        message=str(token_count),
                        status=G_Status.STREAM
                    )
                    last_update_time = current_time
            
            # Проверяем завершение
            if chunk.choices[0].finish_reason is not None:
                break

    except Exception as e:
        print(f"Error in run_open_ai: {e}")
        print(f"Raw response: {full_response}")
        return None
    
    # Валидация JSON
    try:
        # Очистка от markdown
        cleaned = clean_json_response(full_response)
        response = json.loads(cleaned)
        print(response)
        return response
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        print(f"Raw response: {full_response}")
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