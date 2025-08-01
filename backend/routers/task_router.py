from fastapi import APIRouter, Request, Depends, Body
from sqlalchemy.orm import Session

from database.sqlalchemy_tables import get_db
from database.db_upsert_task import db_upsert_task
from database.db_remove_task import db_remove_task
from database.db_get_tasks import db_get_tasks

from schemas.types_tasks import TypeTask
from schemas.types_queries import TypeQuery

from routers.auth_router import unpack_token

router = APIRouter()

@router.post("/get_tasks")
async def get_tasks(request:Request, fields:TypeQuery = Body(...), db:Session = Depends(get_db)):
    """
    Возвращает список задач в соответствии с запросом переданном в fields
    """
    token = request.cookies.get("access_token")
    user_id = unpack_token(token, is_return_id=True)
    result = db_get_tasks(db, fields, user_id)
    return {"status": "success", "result": result}

@router.post("/upsert_task")
async def upsert_task(request:Request, task:TypeTask = Body(...), db:Session = Depends(get_db)):
    """
    Сохраняет новую задачу (если id < 0) и редактирует уже созданную.
    Возвращает обновленную задачу полученную из базы данных.
    """
    token = request.cookies.get("access_token")
    user_id = unpack_token(token, is_return_id=True)
    updateable = db_upsert_task(db, task, user_id)
    return {"status": "success", "updateable": updateable}

@router.post("/remove_task")
async def remove_task(request:Request, body = Body(...), db: Session = Depends(get_db)):
    """
    Удаляет задачу по переданному ID в виде словаря, например {"taskid":23}
    """
    token = request.cookies.get("access_token")
    user_id = unpack_token(token, is_return_id=True)
    db_remove_task(db, body["taskid"], user_id)
    return {"status": "success", "message": body["taskid"]}