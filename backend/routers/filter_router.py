from fastapi import APIRouter, Request, Depends, Body
from sqlalchemy.orm import Session
from schemas.types_filters import TypeFilter

from database.sqlalchemy_tables import get_db
from database.db_get_filters import get_all_filters_list
from database.db_upsert_filter import db_upsert_filter
from database.db_remove_filter import db_remove_filter

from routers.auth_router import unpack_token

router = APIRouter()

@router.post("/get_all_filters")
async def get_all_filters(request:Request, db:Session = Depends(get_db)):
    """
    Возвращает список всех фильтров
    """
    token = request.cookies.get("access_token")
    user_id = unpack_token(token, is_return_id=True)
    result = get_all_filters_list(db, user_id)
    return {"status": "success", "result": result}

@router.post("/upsert_filter")
async def upsert_filter(request:Request, filter:TypeFilter = Body(...), db:Session = Depends(get_db)):
    """
    Cохраняет новый фильтр (если id < 0) или редактирует уже сохраненный.
    Возвращает обновленный фильтр извлеченный из базы данных.
    """
    token = request.cookies.get("access_token")
    user_id = unpack_token(token, is_return_id=True)
    updateable = db_upsert_filter(db, filter, user_id)
    return {"status": "success", "updateable": updateable}

@router.post("/remove_filter")
async def remove_query(request:Request, body = Body(...), db:Session = Depends(get_db)):
    """
    Удаляет тему (фильтр) по переданному ID в виде словаря, например {"filterid":2}
    """
    token = request.cookies.get("access_token")
    user_id = unpack_token(token, is_return_id=True)
    db_remove_filter(db, body["filterid"], user_id)
    return {"status": "success", "message": f'Query with ID {body["filterid"]} was removed.'}