from sqlalchemy import or_, and_
from database.sqlalchemy_tables import Task, Association, TaskCheck
from datetime import datetime
from serializers.returned_task import serialize_task

def get_tasks(db, fields):

    query = db.query(Task)

    print("get_tasks: fields =", fields)

    # if fields.q:
    #     text = f"%{fields.q}%"
    #     query = query.filter(or_(
    #         Task.title.ilike(text), 
    #         Task.description.ilike(text))
    #     )

    # if fields.infilt:
    #     query = query.join(Task.filters).filter(
    #         Association.filter_id.in_(fields.infilt)
    #     )

    # if fields.exfilt:
    #     query = query.join(Task.filters).filter(
    #         ~Association.filter_id.in_(fields.exfilt)
    #     )

    # if fields.crange and fields.crange != "ignore":
    #     crange = fields.crange.split(",")
    #     if len(crange) == 2:
    #         dt0 = datetime.fromisoformat(crange[0].replace("Z", "+00:00"))
    #         dt1 = datetime.fromisoformat(crange[1].replace("Z", "+00:00"))
    #         query = query.filter(Task.created_at.between(dt0, dt1))

    return [serialize_task(task) for task in query.all()]