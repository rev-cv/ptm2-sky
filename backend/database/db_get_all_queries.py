from sqlalchemy.orm import Session
from database.sqlalchemy_tables import Queries
from serializers.returned_query import serialize_query

def db_get_all_queries(db:Session, user_id:int):
    queries = db.query(Queries).filter(Queries.user_id == user_id)
    return [serialize_query(query) for query in queries.all()]
