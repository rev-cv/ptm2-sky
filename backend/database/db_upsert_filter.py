from database.sqlalchemy_tables import Filter
from schemas.types_filters import TypeFilter
from sqlalchemy.orm import Session

def db_upsert_filter(db:Session, f:TypeFilter):
    if f.id < 0:
        filter = Filter(name="", filter_type=f.type)
        db.add(filter)
        db.commit()
        db.refresh(filter)
    else: 
        filter = db.query(Filter).get(f.id)

    filter.name = f.name
    filter.description = f.desc
    # filter.filter_type = f.type

    db.commit()
    db.refresh(filter)
    return {
        "id": filter.id,
        "name": filter.name,
        "desc": filter.description,
        "type": filter.filter_type
    }

