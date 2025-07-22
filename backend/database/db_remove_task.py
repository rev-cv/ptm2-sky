from database.sqlalchemy_tables import Task
from sqlalchemy.orm import Session

def db_remove_task(db: Session, t:int): 

    task = db.query(Task).get(t)
    if task is None:
        return
    
    db.delete(task)
    db.commit()