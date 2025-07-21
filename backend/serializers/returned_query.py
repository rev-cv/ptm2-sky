from schemas.types_get_tasks import TypeQuery

def serialize_query(query):

    def get_risk_impact (elements):
        result = [int(x) if x.isdigit() else x for x in elements.split(",")]
        if len(result) == 1 and result[0] == "":
            result = []
        return result

    return {
        "id": query.id,
        "name": query.name,
        "descr": query.descr,
        "q": query.q,

        "infilt": [x.id for x in query.infilt],
        "exfilt": [x.id for x in query.exfilt],

        "crange": query.crange.split("__"),
        "arange": query.crange.split("__"),
        "drange": query.crange.split("__"),
        "irange": query.crange.split("__"),

        "donerule": [x for x in query.donerule.split(",")],
        "failrule": [x for x in query.failrule.split(",")],
        
        "inrisk": get_risk_impact(query.inrisk),
        "exrisk": get_risk_impact(query.exrisk),

        "inimpact": get_risk_impact(query.inimpact),
        "eximpact": get_risk_impact(query.eximpact),

        "sort": query.sort.split(","),

        "is_default": False,
        "page": 1
    }