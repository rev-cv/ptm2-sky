from database.sqlalchemy_tables import Task
from sqlalchemy.orm import Session
from fastapi import HTTPException

def db_remove_task(db: Session, t:int, user_id:int): 

    task = db.query(Task).get(t)

    if task is None:
        HTTPException(status_code=404, detail="При удалении объект «Task» не был найден")

    if task.user_id != user_id:
        HTTPException(status_code=403, detail="Запрос на удаление объекта «Task», который не принадлежит пользователю")
    
    db.delete(task)
    db.commit()