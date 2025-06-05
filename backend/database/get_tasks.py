from sqlalchemy import or_, and_
from database.sqlalchemy_tables import Task, Association, TaskCheck


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
        query = query.filter(Task.activation >= activation[0])
    if activation[1]:
        query = query.filter(Task.activation <= activation[1])

    # фильтрация по дедлайну
    deadline = filters.get("deadline", [None, None])
    if deadline[0]:
        query = query.filter(Task.deadline >= deadline[0])
    if deadline[1]:
        query = query.filter(Task.deadline <= deadline[1])

    # фильтрация по датам проверок (TaskCheck)
    taskchecks = filters.get("taskchecks", [None, None])
    if any(taskchecks):
        query = query.join(Task.taskchecks)
        if taskchecks[0]:
            query = query.filter(TaskCheck.date >= taskchecks[0])
        if taskchecks[1]:
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

    return [serialize_task(task) for task in query.all()]


def serialize_task(task):

    filters_by_type = {}

    for assoc in task.filters:
        filter_type = assoc.filter.filter_type if assoc.filter else "unknown"
        filter_obj = {
            "id": assoc.id,
            "reason": assoc.reason,
            "proposals": assoc.proposals,
            "name": assoc.filter.name if assoc.filter else None,
            "description": assoc.filter.description if assoc.filter else None
        }

        # Если тип содержит __, делаем вложенность
        if "__" in filter_type:
            main_type, sub_type = filter_type.split("__", 1)
            if main_type not in filters_by_type:
                filters_by_type[main_type] = {}
            if sub_type not in filters_by_type[main_type]:
                filters_by_type[main_type][sub_type] = []
            filters_by_type[main_type][sub_type].append(filter_obj)
        else:
            if filter_type not in filters_by_type:
                filters_by_type[filter_type] = []
            filters_by_type[filter_type].append(filter_obj)

    return {
        "id": task.id,
        "title": task.title,
        "description": task.description,
        "activation": task.activation,
        "deadline": task.deadline,
        "impact": task.impact,
        "risk": task.risk,
        "risk_explanation": task.risk_explanation,
        "risk_proposals": task.risk_proposals,
        "motivation": task.motivation,
        "created_at": task.created_at,
        "filters": filters_by_type
    }