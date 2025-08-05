from dotenv import load_dotenv
import os
from openai import OpenAI
import re
import json

load_dotenv()

APIKEY = os.getenv("OPENROUTER_AI_KEY")
APIURL = os.getenv("OPENROUTER_AI_URL")

json_pattern = re.compile(r'```json\s*(.*?)\s*```', re.DOTALL)

system_prompt = """
НИКОГДА не использовать прямое обращение к пользователю.
Возвращать ответ ТОЛЬКО в виде валидного JSON объекта. 
НЕ использовать markdown форматирование (```json).
НЕ добавлять никаких объяснений или комментариев.
Ответ должен содержать ТОЛЬКО JSON объект, начинающийся с { и заканчивающийся }.
"""

def run_open_ai(message):  # Убираем async
    try:
        client = OpenAI(api_key=APIKEY, base_url=APIURL)
        raw_response = client.chat.completions.create(
            model="google/gemma-3-27b-it:free",
            messages=[
                # {"role": "system", "content": system_prompt},
                {"role": "user", "content": message},
            ],
            stream=False
        )

        # Очистка от markdown
        cleaned = clean_json_response(
            raw_response.choices[0].message.content
        )
        
        # Валидация JSON
        try:
            response = json.loads(cleaned)
            print(response)
            return response
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}")
            print(f"Raw response: {raw_response}")
            return None
    except Exception as e:
        print(f"Error in run_open_ai: {e}")
        return None
    

def clean_json_response(response_text):
    """Извлекает JSON из ответа, игнорируя лишний текст"""
    if not response_text:
        return None
    
    # Ищем JSON блок между ```json и ```
    match = json_pattern.search(response_text)
    
    if match:
        # Если нашли JSON в markdown блоке
        return match.group(1).strip()
    
    # Если нет markdown блоков, ищем JSON объект напрямую
    # Ищем от первой { до последней }
    json_obj_pattern = re.compile(r'\{.*\}', re.DOTALL)
    match = json_obj_pattern.search(response_text)
    
    if match:
        return match.group(0).strip()
    
    return None

if __name__ == "__main__":
    print(run_open_ai(message="Привет"))