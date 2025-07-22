from database.sqlalchemy_tables import Filter
from sqlalchemy.orm import Session

def db_remove_filter(db:Session, q:int): 
    filter = db.query(Filter).get(q)
    if filter is None:
        return
    
    db.delete(filter)
    db.commit()