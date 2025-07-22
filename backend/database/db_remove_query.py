from database.sqlalchemy_tables import Queries
from sqlalchemy.orm import Session

def db_remove_query(db:Session, q:int): 
    query = db.query(Queries).get(q)
    if query is None:
        return
    
    db.delete(query)
    db.commit()