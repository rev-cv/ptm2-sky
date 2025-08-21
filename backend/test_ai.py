import requests
import json
import re
from config import APIKEY, APIURL, OPENROUTER_AI_MODEL

json_pattern = re.compile(r'```json\s*(.*?)\s*```', re.DOTALL)
json_obj_pattern = re.compile(r'\{.*\}', re.DOTALL)

def run_open_ai(message):
    headers = {
        "Authorization": f"Bearer {APIKEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost",  # Required by OpenRouter
        "X-Title": "Test Application"        # Required by OpenRouter
    }
    
    data = {
        "model": OPENROUTER_AI_MODEL,
        "messages": [{"role": "user", "content": message}],
        "stream": True
    }
    
    try:
        print(f"Sending request to: {APIURL}/chat/completions")
        print(f"Model: {OPENROUTER_AI_MODEL}")
        
        response = requests.post(
            f"{APIURL}/chat/completions",
            headers=headers,
            json=data,
            stream=True,
            timeout=30
        )
        
        if response.status_code != 200:
            print(f"API Error: {response.status_code} - {response.text}")
            return None
        
        full_response = ""
        token_count = 0
        
        for line in response.iter_lines():
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
                                print(f"Token {token_count}: {content}")
                    except json.JSONDecodeError:
                        continue
        
        print(f"Total tokens: {token_count}")
        print(f"Full response: {full_response}")
        
        # валидация JSON
        try:
            cleaned = clean_json_response(full_response)
            if cleaned:
                response_json = json.loads(cleaned)
                print(f"Parsed JSON: {response_json}")
                return response_json
            else:
                print("No JSON found in response")
                return None
                
        except json.JSONDecodeError as e:
            print(f"JSON parsing error: {e}")
            print(f"Raw response: {full_response}")
            return None
            
    except Exception as e:
        print(f"Error in run_open_ai: {e}")
        return None

def clean_json_response(response_text):
    """Извлекает JSON из ответа, игнорируя лишний текст"""
    if not response_text:
        return None
    
    # json блок между ```json и ```
    match = json_pattern.search(response_text)
    
    if match:
        return match.group(1).strip()
    
    # если нет markdown блоков, ищется json объект напрямую
    match = json_obj_pattern.search(response_text)
    
    if match:
        return match.group(0).strip()
    
    return None

if __name__ == "__main__":
    result = run_open_ai(message="Привет, ответь в формате JSON: {'message': 'привет'}")
    print(f"Final result: {result}")