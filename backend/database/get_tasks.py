from sqlalchemy import or_, and_
from typing import Any, Dict
from database.sqlalchemy_tables import Task, Association, TaskCheck

def get_tasks_by_filters(db, filters):
    query = db.query(Task)

    if hasattr(filters, "dict"):
        filters = filters.dict()

    # Поиск по тексту (в названии или описании)
    if filters.get("text"):
        text = f"%{filters['text']}%"
        query = query.filter(or_(Task.title.ilike(text), Task.description.ilike(text)))

    # Фильтрация по датам активации
    activation = filters.get("activation", [None, None])
    if activation[0]:
        query = query.filter(Task.activation >= activation[0])
    if activation[1]:
        query = query.filter(Task.activation <= activation[1])

    # Фильтрация по дедлайну
    deadline = filters.get("deadline", [None, None])
    if deadline[0]:
        query = query.filter(Task.deadline >= deadline[0])
    if deadline[1]:
        query = query.filter(Task.deadline <= deadline[1])

    # Фильтрация по датам проверок (TaskCheck)
    taskchecks = filters.get("taskchecks", [None, None])
    if any(taskchecks):
        query = query.join(Task.taskchecks)
        if taskchecks[0]:
            query = query.filter(TaskCheck.date >= taskchecks[0])
        if taskchecks[1]:
            query = query.filter(TaskCheck.date <= taskchecks[1])

    # Фильтрация по risk и impact (массивы чисел)
    if filters.get("risk"):
        query = query.filter(Task.risk.in_(filters["risk"]))
    if filters.get("impact"):
        query = query.filter(Task.impact.in_(filters["impact"]))

    # Фильтрация по filters (ассоциации)
    if filters.get("filters"):
        if filters["filters"]:
            query = query.join(Task.filters).filter(Association.filter_id.in_(filters["filters"]))

    # Сортировка (пример: по дате создания)
    if filters.get("sorted") == "created_at":
        query = query.order_by(Task.created_at.desc())

    # Пагинация (пример: 20 задач на страницу)
    page = filters.get("lastOpenedPage", 1)
    page_size = 20
    query = query.offset((page - 1) * page_size).limit(page_size)

    return query.all()