from database.sqlalchemy_tables import Filter
from sqlalchemy.orm import Session
from fastapi import HTTPException

def db_remove_filter(db:Session, q:int, user_id:int): 
    filter = db.query(Filter).get(q)

    if filter is None:
        HTTPException(status_code=404, detail="При удалении объект «Filter» не был найден")
    
    if filter.user_id != user_id:
        HTTPException(status_code=403, detail="Запрос на удаление объекта «Filter», который не принадлежит пользователю")
    
    db.delete(filter)
    db.commit()