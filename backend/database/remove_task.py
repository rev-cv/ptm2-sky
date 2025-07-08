from database.sqlalchemy_tables import Task, Association, TaskCheck, SubTask
from schemas.types_write_task import TypeTask
from sqlalchemy.orm import Session
from serializers.returned_task import serialize_task


def remove_task(db: Session, t:int): 

    task = db.query(Task).get(t)
    if task is None:
        return
    
    # db.query(Association).filter_by(task_id=task.id).delete()
    # db.query(TaskCheck).filter_by(task_id=task.id).delete()
    # db.query(SubTask).filter_by(task_id=task.id).delete()
    
    db.delete(task)
    db.commit()