from database.sqlalchemy_tables import Queries, Filter, User
from schemas.types_queries import TypeQuery
from sqlalchemy.orm import Session
from serializers.returned_query import serialize_query
from fastapi import HTTPException

def db_upsert_query(db:Session, q:TypeQuery, user_id:int):
    user = db.query(User).get(user_id)
    if not user:
        HTTPException(status_code=401, detail=f"Пользователь не найден")

    if q.id < 0:
        # создание нового запроса
        query = Queries(name="", user=user)
        db.add(query)
        db.commit() # нужно получить id
        db.refresh(query)
    else: 
        # редактирование существующий запрос
        query = db.query(Queries).get(q.id)

    query.name = q.name
    query.descr = q.descr
    query.q = q.q

    query.crange = f"{q.crange[0]}__{q.crange[1]}"
    query.arange = f"{q.arange[0]}__{q.arange[1]}"
    query.irange = f"{q.irange[0]}__{q.irange[1]}"
    query.drange = f"{q.drange[0]}__{q.drange[1]}"
    query.frange = f"{q.frange[0]}__{q.frange[1]}"

    query.inrisk = ','.join(str(x) for x in q.inrisk if x)
    query.exrisk = ','.join(str(x) for x in q.exrisk if x)
    query.inimpact = ','.join(str(x) for x in q.inimpact if x)
    query.eximpact = ','.join(str(x) for x in q.eximpact if x)

    query.donerule = q.donerule
    query.failrule = q.failrule
    query.statusrule = ','.join(str(x) for x in q.statusrule if x)

    query.order_by = ','.join(str(x) for x in q.order_by if x)

    query.infilt = db.query(Filter).filter(Filter.id.in_(q.infilt)).all()
    query.exfilt = db.query(Filter).filter(Filter.id.in_(q.exfilt)).all()

    db.commit()
    db.refresh(query)
    return serialize_query(query)

