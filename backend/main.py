from fastapi import FastAPI, APIRouter
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from database.sqlalchemy_tables import init_db

from routers.websocket import router as api_websocket
from routers.filter_router import router as filter_router
from routers.task_router import router as task_router
from routers.query_router import router as query_router
from routers.auth_router import router as auth_router
from routers.parser_metadata_router import router as metadata_router


app = FastAPI()


init_db()


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
    "https://localhost",
    "https://localhost:8443",
]

origins=["*"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Разрешённые источники
    allow_credentials=True,  # Разрешить отправку куки и заголовков авторизации
    allow_methods=["*"],  # Разрешить все методы (GET, POST, OPTIONS и т.д.)
    allow_headers=["*"],  # Разрешить все заголовки
)


api_routers = APIRouter(prefix="/api", tags=["api"])
api_routers.include_router(auth_router)
api_routers.include_router(filter_router)
api_routers.include_router(task_router)
api_routers.include_router(query_router)
api_routers.include_router(metadata_router)


app.include_router(api_routers)
app.include_router(api_websocket)


@app.get("/")
@app.get("/auth")
@app.get("/sus")
async def spa_root():
    return FileResponse("dist/index.html")


app.mount("/", StaticFiles(directory="dist"), name="dist")

