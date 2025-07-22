from sqlalchemy import or_, and_
from database.sqlalchemy_tables import Task, Association, TaskCheck
from datetime import datetime, timezone, timedelta
from serializers.returned_task import serialize_task
import re


pattern = re.compile(r'\d{1,3}')


def extract_first_match(text):
    match = pattern.search(text)
    return match.group(0) if match else None


def db_get_tasks(db, fields):

    query = db.query(Task)

    if fields.q:
        text = f"%{fields.q}%"
        query = query.filter(or_(
            Task.title.ilike(text), 
            Task.description.ilike(text))
        )

    if fields.infilt:
        query = query.join(Task.filters).filter(
            Association.filter_id.in_(fields.infilt)
        )

    if fields.exfilt:
        query = query.join(Task.filters).filter(
            ~Association.filter_id.in_(fields.exfilt)
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

    if fields.crange[0]:
        dt = getDate(fields.crange[0], offset=fields.tz)
        if dt:
            query = query.filter(dt <= Task.created_at)
    if fields.crange[1]:
        dt = getDate(fields.crange[1], offset=fields.tz, is_finish=True)
        if dt:
            query = query.filter(Task.created_at < dt)

    if fields.arange[0]:
        dt = getDate(fields.arange[0], offset=fields.tz)
        if dt:
            query = query.filter(dt <= Task.activation)
    if fields.arange[1]:
        dt = getDate(fields.arange[1], offset=fields.tz, is_finish=True)
        if dt:
            query = query.filter(Task.activation < dt)

    if fields.drange[0]:
        dt = getDate(fields.drange[0], offset=fields.tz)
        if dt:
            query = query.filter(dt <= Task.deadline)
    if fields.drange[1]:
        dt = getDate(fields.drange[1], offset=fields.tz, is_finish=True)
        if dt:
            query = query.filter(Task.deadline < dt)

    if fields.irange[0]:
        dt = getDate(fields.irange[0], offset=fields.tz)
        if dt:
            query = query.join(TaskCheck).filter(dt <= TaskCheck.date)
    if fields.irange[1]:
        dt = getDate(fields.irange[1], offset=fields.tz, is_finish=True)
        if dt:
            query = query.join(TaskCheck).filter(TaskCheck.date < dt)

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

