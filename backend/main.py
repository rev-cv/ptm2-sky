from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from routers.api_router import router as ApiRouter
from routers.websocket import router as WebSocket
from fastapi.middleware.cors import CORSMiddleware
from database.sqlalchemy_tables import init_db

init_db()

app = FastAPI()

# Настройка CORS
origins = [
    "http://localhost:5173",
    "https://localhost:5173",
    "https://localhost:3000",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "https://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "https://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Разрешённые источники
    allow_credentials=True,  # Разрешить отправку куки и заголовков авторизации
    allow_methods=["*"],  # Разрешить все методы (GET, POST, OPTIONS и т.д.)
    allow_headers=["*"],  # Разрешить все заголовки
)

app.include_router(ApiRouter)
app.include_router(WebSocket)

@app.get("/hello", response_class=HTMLResponse)
async def read_hello(request: Request):
    return HTMLResponse("Hollo World!")

