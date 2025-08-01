from database.sqlalchemy_tables import Filter, User
from schemas.types_filters import TypeFilter
from sqlalchemy.orm import Session
from fastapi import HTTPException

def db_upsert_filter(db:Session, f:TypeFilter, user_id:int):
    user = db.query(User).get(user_id)
    if not user:
        HTTPException(status_code=401, detail=f"Пользователь не найден")

    if f.id < 0:
        filter = Filter(
            name="", 
            filter_type=f.type, 
            user=user
        )
        db.add(filter)
        db.commit()
        db.refresh(filter)
    else: 
        filter = db.query(Filter).get(f.id)

    filter.name = f.name
    filter.description = f.desc

    db.commit()
    db.refresh(filter)
    return {
        "id": filter.id,
        "name": filter.name,
        "desc": filter.description,
        "type": filter.filter_type
    }

