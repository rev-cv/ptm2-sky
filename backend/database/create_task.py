from database.sqlalchemy_tables import Task, Association, SubTask, TaskCheck, Filter
from datetime import datetime, timezone

def parse_iso_datetime(dt_str):
    try:
        if not dt_str:
            raise ValueError("Empty string")
        dt = datetime.fromisoformat(dt_str)
        if dt.tzinfo is None:
            return dt.replace(tzinfo=timezone.utc)
        return dt.astimezone(timezone.utc)
    except Exception:
        return datetime.now(timezone.utc)

def get_or_create_filter(db, filter_data, filter_type):
    if getattr(filter_data, "id", None):
        db_filter = db.query(Filter).filter_by(id=filter_data.id).first()
        if db_filter:
            return db_filter
    
    # если id нет - создать новый фильтр
    db_filter = Filter(
        name=filter_data.name,
        description=getattr(filter_data, "description", ""),
        filter_type=filter_type
    )

    db.add(db_filter)
    db.flush()  # чтобы получить id
    return db_filter

def write_new_task_to_database(task_data, db):

    # подзадачи
    subtasks = []
    if task_data.subtasks:
        for index, sub in enumerate(task_data.subtasks):
            db_sub = SubTask(
                title=sub.title,
                description=sub.description,
                instruction=sub.instruction,
                continuance=sub.continuance,
                motivation=sub.motivation,
                order=index
            )
            subtasks.append(db_sub)

    # activation, deadline, taskchecks (даты)
    deadline = None if not task_data.deadline else parse_iso_datetime(task_data.deadline)
    activation = None if not task_data.deadline else parse_iso_datetime(task_data.deadline)

    taskchecks = []
    if task_data.taskchecks:
        for date_str in task_data.taskchecks:
            db_check = TaskCheck(date=parse_iso_datetime(date_str))
            taskchecks.append(db_check)

    # --- Ассоциации фильтров ---
    associations = []

    # Темы (match_themes и new_themes)
    for theme_list, category in [
        (task_data.match_themes or [], "theme"),
        (task_data.new_themes or [], "theme"),
    ]:
        for theme in theme_list:
            db_filter = get_or_create_filter(db, theme, category)
            assoc = Association(
                filter_id=db_filter.id,
                relevance = theme.match_percentage,
                reason=theme.reason
            )
            associations.append(assoc)


    # States (physical, intellectual, emotional, motivational, social)
    if task_data.states:
        for state_category in ["physical", "intellectual", "emotional", "motivational", "social"]:
            assoc_list = getattr(task_data.states, state_category, [])
            for assoc_data in assoc_list:
                db_filter = get_or_create_filter(db, assoc_data, f"state__{state_category}")
                assoc = Association(
                    filter_id=db_filter.id,
                    reason=assoc_data.reason
                )
                associations.append(assoc)

    # Stress
    if task_data.stress:
        for assoc_data in task_data.stress:
            db_filter = get_or_create_filter(db, assoc_data, "stress")
            assoc = Association(
                filter_id=db_filter.id,
                reason=assoc_data.reason
            )
            associations.append(assoc)

    # Action type
    if task_data.action_type:
        for assoc_data in task_data.action_type:
            db_filter = get_or_create_filter(db, assoc_data, "action_type")
            assoc = Association(
                filter_id=db_filter.id,
                reason=assoc_data.reason
            )
            associations.append(assoc)

    # --- Создание задачи ---
    task = Task(
        title=task_data.title,
        description=task_data.description,
        subtasks=subtasks,

        activation=activation,
        deadline=deadline,
        taskchecks=taskchecks,

        impact=task_data.impact,
        risk=task_data.risk,
        risk_explanation = getattr(task_data, "risk_explanation", ""),
        risk_proposals = getattr(task_data, "risk_proposals", ""),
        motivation=task_data.motivation,
        
        filters=associations
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task
