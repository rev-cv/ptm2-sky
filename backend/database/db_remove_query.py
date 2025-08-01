from database.sqlalchemy_tables import Queries
from sqlalchemy.orm import Session
from fastapi import HTTPException

def db_remove_query(db:Session, q:int, user_id): 
    query = db.query(Queries).get(q)

    if query is None:
        HTTPException(status_code=404, detail="При удалении объект «Queries» не был найден")

    if query.user_id != user_id:
        HTTPException(status_code=403, detail="Запрос на удаление объекта «Queries», который не принадлежит пользователю")
    
    db.delete(query)
    db.commit()