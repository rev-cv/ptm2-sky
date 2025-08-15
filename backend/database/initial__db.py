import json
from database.sqlalchemy_tables import Filter

def initialize_filters_from_json(db, json_path="database/initial_data.json"):
    # проверка, есть ли уже фильтры
    if db.query(Filter).first():
        return  # уже инициализировано

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    for filter_type, items in data.items():
        for item in items:
            db_filter = Filter(
                name=item["name"],
                filter_type=filter_type,
                description=item.get("description", "")
            )
            db.add(db_filter)
    db.commit()