from sqlalchemy.orm import Session
from sqlalchemy import or_
from database.sqlalchemy_tables import Filter
import json

def get_all_filters_dict(db, is_ai_promt=False):
    """
    Возвращает словарь фильтров, где ключи — filter_type.
    Если filter_type содержит '__', то формируется вложенный словарь.
    """
    filters = db.query(Filter).all()
    result = {}

    for f in filters:
        key = f.filter_type
        value = {
            "id": f.id,
            "name": f.name,
            "description": f.description
        }

        if is_ai_promt:
            value["is_user_defined"] = f.is_user_defined
        
        if "__" in key:
            main_key, sub_key = key.split("__", 1)
            if main_key not in result:
                result[main_key] = {}
            if sub_key not in result[main_key]:
                result[main_key][sub_key] = []
            result[main_key][sub_key].append(value)
        else:
            if key not in result:
                result[key] = []
            result[key].append(value)

    return result

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


def get_completed_promt(promt, db):
    filters = get_all_filters_dict(db)

    nmtp = str(promt)

    rep_temp = [
        ["%%%THEME%%%", "theme"],
        ["%%%STATE%%%", "state"],
        ["%%%ACTION_LEVEL%%%", "action_type"],
        ["%%%STRESS%%%", "stress"],
    ]

    for temp, filter_type in rep_temp:
        if filter_type in filters:
            json_data = json.dumps(filters[filter_type], ensure_ascii=False, indent=2)
            nmtp = nmtp.replace(temp, json_data)
    return nmtp