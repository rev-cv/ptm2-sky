from database.sqlalchemy_tables import Task, Association, TaskCheck, Filter, SubTask
from schemas.types_update_task import TypeTask
from sqlalchemy.orm import Session
from serializers.returned_task import serialize_task
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

def update_task(db: Session, t: TypeTask):
    task = db.query(Task).get(t.id)   

    if t.status is not None:
        task.status = t.status

    if t.title is not None:
        task.title = t.title

    if t.description is not None:
        task.description = t.description

    if t.motivation is not None:
        task.motivation = t.motivation

    if t.activation is not None:
        if t.activation == "":
            task.activation = None
        else:
            try:
                activation_time = datetime.strptime(t.activation, "%a, %d %b %Y %H:%M:%S GMT")
                task.activation = activation_time.replace(tzinfo=ZoneInfo("UTC"))
            except ValueError as e:
                raise ValueError("Invalid UTC string format in activation") from e
            
    if t.deadline is not None:
        if t.deadline == "":
            task.deadline = None
        else:
            try:
                deadline_time = datetime.strptime(t.deadline, "%a, %d %b %Y %H:%M:%S GMT")
                task.deadline = deadline_time.replace(tzinfo=ZoneInfo("UTC"))
            except ValueError as e:
                raise ValueError("Invalid UTC string format in deadline") from e
            
    if t.taskchecks is not None:
        if len(t.taskchecks) == 0:
            db.query(TaskCheck).filter(TaskCheck.task_id == t.id).delete()
        else:
            try:
                new_dates = [
                    datetime.strptime(utc_string, "%a, %d %b %Y %H:%M:%S GMT").replace(tzinfo=ZoneInfo("UTC"))
                    for utc_string in t.taskchecks
                ]
            except ValueError as e:
                raise ValueError("Invalid UTC string format in taskchecks") from e
            
            current_dates = [tc.date for tc in task.taskchecks]
            dates_to_add = [d for d in new_dates if d not in current_dates]
            dates_to_delete = [d for d in current_dates if d not in new_dates]

            # добавить новые записи
            for date in dates_to_add:
                new_taskcheck = TaskCheck(task_id=t.id, date=date)
                db.add(new_taskcheck)

            # удалить отсутствующие записи
            if dates_to_delete:
                db.query(TaskCheck).filter(
                    TaskCheck.task_id == t.id,
                    TaskCheck.date.in_(dates_to_delete)
                ).delete(synchronize_session=False)

    if t.impact is not None:
        task.impact = t.impact

    if t.risk is not None:
        task.risk = t.risk

    if t.risk_proposals is not None:
        task.risk_proposals = t.risk_proposals
    
    if t.risk_explanation is not None:
        task.risk_explanation = t.risk_explanation

    if t.filter_list is not None:
        current_assoc = [f.id for f in task.filters]
        assoc_to_adding = [f.id for f in t.filter_list]
        assoc_to_delete = [d for d in current_assoc if d not in assoc_to_adding]

        if assoc_to_delete:
            db.query(Association).filter(Association.id.in_(assoc_to_delete)).delete(synchronize_session=False)

        for assoc in t.filter_list:
            if assoc.id < 0:
                # если ассоциация с фильтром еще не создана, нужно создать
                filter = db.query(Filter).get(assoc.idf)
                task.filters.append(
                    Association(filter=filter, reason=assoc.reason)
                )
            else:
                assoc_obj = db.query(Association).get(assoc.id)
                assoc_obj.reason = assoc.reason

    if t.subtasks is not None:
        current_st = [st.id for st in task.subtasks]
        st_to_adding = [f.id for f in t.subtasks]
        st_to_delete = [d for d in current_st if d not in st_to_adding]

        if st_to_delete:
            db.query(SubTask).filter(SubTask.id.in_(st_to_delete)).delete(synchronize_session=False)

        for st in t.subtasks:
            if st.id < 0:
                # если подадача не создана
                task.subtasks.append(
                    SubTask(
                        status = st.status,
                        title = st.title,
                        instruction = st.instruction,
                        description = st.description,
                        continuance = st.continuance,
                        motivation = st.motivation,
                        order = st.order,
                    )
                )
            else:
                original = next((s for s in task.subtasks if s.id == st.id), None)
                if original:
                    original.status = st.status
                    original.title = st.title
                    original.instruction = st.instruction
                    original.description = st.description
                    original.continuance = st.continuance
                    original.motivation = st.motivation
                    original.order = st.order

    db.commit()
    db.refresh(task)
    return serialize_task(task)