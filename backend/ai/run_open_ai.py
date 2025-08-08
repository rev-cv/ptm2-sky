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

def run_open_ai(message):
    try:
        client = OpenAI(api_key=APIKEY, base_url=APIURL)
        raw_response = client.chat.completions.create(
            # model="google/gemma-3-27b-it:free",
            model="deepseek/deepseek-r1-0528:free",
            messages=[
                # {"role": "system", "content": system_prompt},
                {"role": "user", "content": message},
            ],
            stream=False
        )

    except Exception as e:
        print(f"Error in run_open_ai: {e}")
        print(f"Raw response: {raw_response}")
        return None
    
    # Валидация JSON
    try:
        # Очистка от markdown
        cleaned = clean_json_response(
            raw_response.choices[0].message.content
        )
        response = json.loads(cleaned)
        print(response)
        return response
    except json.JSONDecodeError as e:
        print(f"JSON parsing error: {e}")
        print(f"Raw response: {raw_response}")
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