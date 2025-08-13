from sqlalchemy.orm import Session
from sqlalchemy import or_
from database.sqlalchemy_tables import Filter
from database.sqlalchemy_tables import get_db

def get_all_filters_list(db: Session, user_id: int):
    filters = db.query(Filter).filter(
        or_(Filter.user_id == user_id, Filter.user_id == None)
    ).all()
    result = [
        {
            "id": f.id,
            "name": f.name,
            "desc": f.description,
            "type": f.filter_type
        }
        for f in filters
    ] if filters else []

    return result

def get_themes_by_ai_generate(user_id: int):
    db = next(get_db())

    try:
        themes = (db.query(Filter)
            .filter(Filter.filter_type == "theme")
            .filter(Filter.user_id == user_id)
            .all()
        )
    finally:
        db.close()

    result = [
        {
            "id": f.id,
            "name": f.name,
            "description": f.description
        }
        for f in themes
    ] if themes else []

    return result



