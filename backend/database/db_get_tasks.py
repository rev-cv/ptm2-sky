from sqlalchemy.orm import Session
from sqlalchemy import or_, and_, not_
from sqlalchemy.sql import case
from database.sqlalchemy_tables import Task, Association, TaskCheck
from datetime import datetime, timezone, timedelta
from serializers.returned_task import serialize_task
import re
from schemas.types_queries import TypeQuery

from sqlalchemy.orm import Session

pattern = re.compile(r'\d{1,3}')

def extract_first_match(text):
    match = pattern.search(text)
    return match.group(0) if match else None

sorting_paramentrs = {
    "created_asc": Task.created_at.asc(),
    "created_desc": Task.created_at.desc(),
    "deadline_asc": Task.deadline.asc(),
    "deadline_desc": Task.deadline.desc(),
    "activation_asc": Task.activation.asc(),
    "activation_desc": Task.activation.desc(),
    "finished_asc": Task.finished_at.asc(),
    "finished_desc": Task.finished_at.desc(),
    "name_asc": Task.title.asc(),
    "name_desc": Task.title.desc(),
    "risk_asc": Task.risk.asc(),
    "risk_desc": Task.risk.desc(),
    "impact_asc": Task.impact.asc(),
    "impact_asc": Task.impact.desc(),
}


def db_get_tasks(db: Session, fields: TypeQuery, user_id: int):

    cdt = datetime.now().astimezone(timezone.utc)

    query = db.query(Task).filter(Task.user_id == user_id)

    if fields.q:
        text = f"%{fields.q}%"
        query = query.filter(or_(
            Task.title.ilike(text), 
            Task.description.ilike(text))
        )

    if fields.statusrule and "" not in fields.statusrule:
        if "done" in fields.statusrule:
            query = query.filter(Task.status == True)
        
        if "wait" in fields.statusrule and "fail" in fields.statusrule:
            query = query.filter(Task.status == False)
        elif "fail" in fields.statusrule:
            query = query.filter(and_(Task.status == False, Task.deadline < cdt))
        elif "wait" in fields.statusrule:
            query = query.filter(Task.status == False)
            query = query.filter(or_(Task.deadline == None, cdt < Task.deadline))


    if fields.infilt:
        query = query.filter(
            Task.filters.any(Association.filter_id.in_(fields.infilt))
        )

    if fields.exfilt:
        query = query.filter(
            ~Task.filters.any(Association.filter_id.in_(fields.exfilt))
    )
 
    if fields.inrisk:
        query = query.filter(
            Task.risk.in_(fields.inrisk)
        )

    if fields.exrisk:
        query = query.filter(
            ~Task.risk.in_(fields.exrisk)
        )
    
    if fields.inimpact:
        query = query.filter(
            Task.impact.in_(fields.inimpact)
        )

    if fields.eximpact:
        query = query.filter(
            ~Task.impact.in_(fields.eximpact)
        )

    # дата создания
    if fields.crange[0]:
        dt = getDate(fields.crange[0], offset=fields.tz)
        if dt:
            query = query.filter(dt <= Task.created_at)
    if fields.crange[1]:
        dt = getDate(fields.crange[1], offset=fields.tz, is_finish=True)
        if dt:
            query = query.filter(Task.created_at < dt)

    # активация
    if fields.arange[0]:
        dt = getDate(fields.arange[0], offset=fields.tz)
        if dt:
            query = query.filter(dt <= Task.activation)
    if fields.arange[1]:
        dt = getDate(fields.arange[1], offset=fields.tz, is_finish=True)
        if dt:
            query = query.filter(Task.activation < dt)

    # дедлайн
    if fields.drange[0]:
        dt = getDate(fields.drange[0], offset=fields.tz)
        if dt:
            query = query.filter(dt <= Task.deadline)
    if fields.drange[1]:
        dt = getDate(fields.drange[1], offset=fields.tz, is_finish=True)
        if dt:
            query = query.filter(Task.deadline < dt)

    # проверки
    if fields.irange[0] or fields.irange[1]:
        query = query.join(TaskCheck)
        if fields.irange[0]:
            dt_start = getDate(fields.irange[0], offset=fields.tz)
            if dt_start:
                query = query.filter(dt_start <= TaskCheck.date)
        if fields.irange[1]:
            dt_end = getDate(fields.irange[1], offset=fields.tz, is_finish=True)
            if dt_end:
                query = query.filter(TaskCheck.date < dt_end)
    
    # дата успешного завершения
    if fields.frange[0]:
        dt = getDate(fields.frange[0], offset=fields.tz)
        if dt:
            query = query.filter(dt <= Task.finished_at)
    if fields.frange[1]:
        dt = getDate(fields.frange[1], offset=fields.tz, is_finish=True)
        if dt:
            query = query.filter(Task.finished_at < dt)


    order_by = []
    for s in fields.order_by:
        st = sorting_paramentrs.get(s, None)
        if st is not None:
            order_by.insert(0, st)


    # -----------------
    # НАЧАЛО блока кода отвечающего за группировку задач по статусу выполнения
    if fields.donerule or fields.failrule:
        if fields.donerule == "exclude":
            query = query.filter(~Task.status == True)

        if fields.failrule == "exclude":
            query = query.filter(or_(Task.deadline > cdt, Task.deadline == None))

        if fields.donerule == "toend" and fields.failrule == "toend":
            order_by.insert(0,
                    case(
                        (and_(Task.status == False, Task.deadline < cdt), 2),
                        (Task.status == True, 1),
                        else_=0
                    ).asc()
                )
        elif fields.donerule == "tostart" and fields.failrule == "toend":
            order_by.insert(0,
                    case(
                        (and_(Task.status == False, Task.deadline < cdt), 2),
                        (Task.status == True, 0),
                        else_=1
                    ).asc()
                )
        elif fields.donerule == "toend" and fields.failrule == "tostart":
            order_by.insert(0,
                    case(
                        (and_(Task.status == False, Task.deadline < cdt), 0),
                        (Task.status == True, 2),
                        else_=1
                    ).asc()
                )
        elif fields.donerule == "tostart" and fields.failrule == "tostart":
            order_by.insert(0,
                    case(
                        (and_(Task.status == False, Task.deadline < cdt), 0),
                        (Task.status == True, 1),
                        else_=2
                    ).asc()
                )
        elif fields.donerule == "tostart":
            order_by.insert(0, case((Task.status == True, 0), else_=1).asc())
        elif fields.donerule == "toend":
            order_by.insert(0, case((Task.status == True, 1), else_=0).asc())
        elif fields.failrule == "tostart":
            order_by.insert(0, case((and_(Task.status == False, Task.deadline < cdt), 0), else_=1).asc())
        elif fields.failrule == "toend":
            order_by.insert(0, case((and_(Task.status == False, Task.deadline < cdt), 1), else_=0).asc())
    
    # КОНЕЦ блока кода оотвечающего за группировку задач по статусу выполнения
    # -----------------

    query = query.order_by(*order_by)
    return [serialize_task(task) for task in query.all()]


def getDate (text, offset=0, is_finish=False):

    if "after" in text or "before" in text:
        
        current_date = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)

        days = extract_first_match(text)

        if not days:
            return None
        
        try:
            days_int = int(days)
        except (ValueError, TypeError):
            return None
        
        if "before" in text:
            days_int *= -1
        
        if is_finish:
            days_int += 1

        return current_date + timedelta(days=days_int, minutes=offset)

    else:

        dt = datetime.fromisoformat(text)

        if not dt:
            return None
        
        if is_finish:
            dt = dt + timedelta(days=1)

        return dt

