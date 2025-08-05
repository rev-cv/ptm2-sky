from fastapi import APIRouter

from routers.filter_router import router as filter_router
from routers.task_router import router as task_router
from routers.query_router import router as query_router
from routers.auth_router import router as auth_router

tasks = {}       # Хранилище задач
websockets = {}  # Храним активные WebSocket-соединения для каждой задачи

router = APIRouter(prefix="/api", tags=["api"])
router.include_router(auth_router)
router.include_router(filter_router)
router.include_router(task_router)
router.include_router(query_router)
