
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
        "arange": query.arange.split("__"),
        "drange": query.drange.split("__"),
        "irange": query.irange.split("__"),
        "frange": query.frange.split("__"),

        "donerule": query.donerule,
        "failrule": query.failrule,
        "statusrule": query.statusrule.split(","),

        "inrisk": get_risk_impact(query.inrisk),
        "exrisk": get_risk_impact(query.exrisk),

        "inimpact": get_risk_impact(query.inimpact),
        "eximpact": get_risk_impact(query.eximpact),

        "order_by": query.order_by.split(","),

        "is_default": False,
        "page": 1
    }
