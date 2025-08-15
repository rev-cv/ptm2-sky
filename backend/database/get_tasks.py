from sqlalchemy import or_, and_
from database.sqlalchemy_tables import Task, Association, TaskCheck
from datetime import datetime
from serializers.returned_task import serialize_task_new

def get_tasks_by_filters(db, filters):
    query = db.query(Task)

    if hasattr(filters, "dict"):
        filters = filters.dict()

    # поиск по тексту (в названии или описании)
    if filters.get("text"):
        text = f"%{filters['text']}%"
        query = query.filter(or_(Task.title.ilike(text), Task.description.ilike(text)))

    # фильтрация по датам активации
    activation = filters.get("activation", [None, None])
    if activation[0]:
        dt0 = datetime.fromisoformat(activation[0].replace("Z", "+00:00"))
        query = query.filter(Task.activation >= dt0)
    if activation[1]:
        dt1 = datetime.fromisoformat(activation[1].replace("Z", "+00:00"))
        query = query.filter(Task.activation <= dt1)

    # фильтрация по дедлайну
    deadline = filters.get("deadline", [None, None])
    if deadline[0]:
        dt0 = datetime.fromisoformat(deadline[0].replace("Z", "+00:00"))
        query = query.filter(Task.deadline >= dt0)
    if deadline[1]:
        dt1 = datetime.fromisoformat(deadline[1].replace("Z", "+00:00"))
        query = query.filter(Task.deadline <= dt1)

    # фильтрация по датам проверок (TaskCheck)
    taskchecks = filters.get("taskchecks", [None, None])
    if any(taskchecks):
        query = query.join(Task.taskchecks)
        if taskchecks[0]:
            dt0 = datetime.fromisoformat(taskchecks[0].replace("Z", "+00:00"))
            query = query.filter(TaskCheck.date >= taskchecks[0])
        if taskchecks[1]:
            dt0 = datetime.fromisoformat(taskchecks[1].replace("Z", "+00:00"))
            query = query.filter(TaskCheck.date <= taskchecks[1])

    # фильтрация по risk и impact (массивы чисел)
    if filters.get("risk"):
        query = query.filter(Task.risk.in_(filters["risk"]))
    if filters.get("impact"):
        query = query.filter(Task.impact.in_(filters["impact"]))

    # фильтрация по filters (ассоциациям)
    if filters.get("filters"):
        if filters["filters"]:
            query = query.join(Task.filters).filter(Association.filter_id.in_(filters["filters"]))

    # сортировка (пример: по дате создания)
    if filters.get("sorted") == "created_at":
        query = query.order_by(Task.created_at.desc())

    # пагинация (пример: 20 задач на страницу)
    page = filters.get("lastOpenedPage", 1)
    page_size = 20
    query = query.offset((page - 1) * page_size).limit(page_size)

    return [serialize_task_new(task) for task in query.all()]
