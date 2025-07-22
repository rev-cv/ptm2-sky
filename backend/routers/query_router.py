from fastapi import APIRouter, Request, Depends, Body
from sqlalchemy.orm import Session

from database.sqlalchemy_tables import get_db
from database.db_upsert_query import db_upsert_query
from database.db_get_all_queries import db_get_all_queries
from database.db_remove_query import db_remove_query

from schemas.types_queries import TypeQuery

router = APIRouter()

@router.post("/get_all_queries")
async def get_all_queries(request: Request, db: Session = Depends(get_db)):
    result = db_get_all_queries(db)
    return {"status": "success", "result": result}

@router.post("/upsert_query")
async def upsert_query(request:Request, query:TypeQuery = Body(...), db:Session = Depends(get_db)):
    """
    Cохраняет новый запрос (если id < 0) или редактирует уже сохраненный.
    Возвращает обновленный запрос извлеченный из базы данных.
    """
    updateable = db_upsert_query(db, query)
    return {"status": "success", "updateable": updateable}

@router.post("/remove_query")
async def remove_query(request:Request, body = Body(...), db:Session = Depends(get_db)):
    """
    Удаляет сохраненный запрос по переданному ID в виде словаря, например {"queryid":2}
    """
    db_remove_query(db, body["queryid"])
    return {"status": "success", "message": f'Query with ID {body["queryid"]} was removed.'}