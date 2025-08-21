import os
from dotenv import load_dotenv
from pathlib import Path


def load_environment():
    # Пробуем разные пути к .env
    possible_paths = [
        Path(__file__).resolve().parent.parent / '.env',  # ../.env
        Path(__file__).resolve().parent / '.env',         # ./backend/.env
        Path('.env')                                      # текущая директория
    ]
    
    for env_path in possible_paths:
        if env_path.exists():
            load_dotenv(dotenv_path=env_path)
            # print(f"INFO:     ✅ Loaded .env from: {env_path}", flush=True)
            return
        
    print(f"INFO:     ⚠️ .env file not found, using environment variables", flush=True)

# загрузка переменных из корневого .env
load_environment()

IS_PRODACTION = True if os.getenv("IS_PRODACTION") == "true" else False

# ↓ переменные SSL
SSL_CERT_FILE = os.getenv("SSL_CERT_FILE")
SSL_KEY_FILE = os.getenv("SSL_KEY_FILE")
SSL_ENABLED= True if os.getenv("SSL_ENABLED") == "true" else False

# ↓ переменны для базы данных
# DATABASE_URL = os.getenv("DATABASE_URL")
# POSTGRES_DB=os.getenv("POSTGRES_DB")
# POSTGRES_USER=os.getenv("POSTGRES_USER")
# POSTGRES_PASSWORD=os.getenv("POSTGRES_PASSWORD")
# DATABASE_URL = f'postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@localhost:5432/{POSTGRES_DB}'
DATABASE_URL=os.getenv("DATABASE_URL")

# ↓ переменные для подключения к OpenRounter
APIKEY = os.getenv("OPENROUTER_AI_KEY")
APIURL = os.getenv("OPENROUTER_AI_URL")
OPENROUTER_AI_MODEL = os.getenv("OPENROUTER_AI_MODEL")

# ↓ переменные для управления токенами аутентификации
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")
JWT_ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES"))
JWT_REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("JWT_REFRESH_TOKEN_EXPIRE_DAYS"))

# ↓ число пагинации (элементов на одной странице)
TASKS_PAGE_SIZE = int(os.getenv("TASKS_PAGE_SIZE"))

# DEBUG = os.getenv("DEBUG", "False").lower() == "true"  # Пример с преобразованием типа

# логика валидации
# if not DATABASE_URL:
#     raise ValueError("DATABASE_URL не установлена в .env файле")
