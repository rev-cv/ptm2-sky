from database.sqlalchemy_tables import Queries
from serializers.returned_query import serialize_query

def get_all_queries(db):
    queries = db.query(Queries)
    return [serialize_query(query) for query in queries.all()]
