
def serialize_task(task):

    filters_by_type = {
        "theme": [],
        "stress": [],
        "action_type": [],
        "state": {
            "physical": [],
            "intellectual": [],
            "emotional": [],
            "motivational": [],
            "social": [],
        }
    }

    for assoc in task.filters:
        filter_obj = {
            "id": assoc.id, 
            "idf": assoc.filter.id, # фильтр с которым связана ассоциация
            "reason": assoc.reason,
            "name": assoc.filter.name if assoc.filter else None,
            "description": assoc.filter.description if assoc.filter else None
        }

        filter_type = assoc.filter.filter_type if assoc.filter else "unknown"

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
        "status": task.status,
        "title": task.title,
        "description": task.description,
        "activation": task.activation.strftime("%Y-%m-%dT%H:%M:%SZ") if task.activation else task.activation,
        "deadline": task.deadline.strftime("%Y-%m-%dT%H:%M:%SZ") if task.deadline else task.deadline,
        "impact": task.impact,
        "subtasks" : task.subtasks,
        "risk": task.risk,
        "risk_explanation": task.risk_explanation,
        "risk_proposals": task.risk_proposals,
        "motivation": task.motivation,
        "created_at": task.created_at.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "finished_at": task.finished_at.strftime("%Y-%m-%dT%H:%M:%SZ") if task.finished_at else task.finished_at,
        "filters": filters_by_type,
        "taskchecks": [
            tc.date.strftime("%Y-%m-%dT%H:%M:%SZ") if tc.date else tc.date
            for tc in task.taskchecks
        ],
    }


def serialize_task_new(task):

    themes = []
    actions = []

    for assoc in task.filters:
        filter_obj = {
            "id": assoc.id, 
            "idf": assoc.filter.id, # фильтр с которым связана ассоциация
            "reason": assoc.reason,
            "name": assoc.filter.name if assoc.filter else "",
            "description": assoc.filter.description if assoc.filter else ""
        }

        filter_type = assoc.filter.filter_type if assoc.filter else "unknown"
        
        if filter_type == "theme":
            themes.append(filter_obj)
        elif filter_type == "action_type":
            actions.append(filter_obj)

    return {
        "id": task.id,
        "status": task.status,
        "title": task.title,
        "description": task.description,
        "activation": task.activation.strftime("%Y-%m-%dT%H:%M:%SZ") if task.activation else task.activation,
        "deadline": task.deadline.strftime("%Y-%m-%dT%H:%M:%SZ") if task.deadline else task.deadline,
        "impact": task.impact,
        "subtasks" : task.subtasks,
        "risk": task.risk,
        "risk_explanation": task.risk_explanation,
        "risk_proposals": task.risk_proposals,
        "motivation": task.motivation,
        "created_at": task.created_at.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "finished_at": task.finished_at.strftime("%Y-%m-%dT%H:%M:%SZ") if task.finished_at else task.finished_at,
        "taskchecks": [
            tc.date.strftime("%Y-%m-%dT%H:%M:%SZ") if tc.date else tc.date
            for tc in task.taskchecks
        ],
        "themes": themes,
        "actions": actions,
        "stress": task.stress,
        "apathy":  task.apathy,
        "meditative":  task.meditative,
        "comfort":  task.comfort,
        "automaticity":  task.automaticity,
        "significance":  task.significance,
        
        "physical":  task.physical,
        "intellectual":  task.intellectual,
        "motivational":  task.motivational,
        "emotional":  task.emotional,
        "financial":  task.financial,
        "temporal":  task.temporal,
        "social": task.social
    }

