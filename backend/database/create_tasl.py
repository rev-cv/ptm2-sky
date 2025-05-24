from database.sqlalchemy_tables import Task, Theme, Association, States, SubTask, RiskExplanation, TaskCheck
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


def get_or_create_theme(theme_data, db):
    theme = db.query(Theme).filter_by(
        name=theme_data.name,
        description=theme_data.description,
        match_percentage=theme_data.match_percentage,
        reason=theme_data.reason
    ).first()
    if not theme:
        theme = Theme(
            name=theme_data.name,
            description=theme_data.description,
            match_percentage=theme_data.match_percentage,
            reason=theme_data.reason
        )
        db.add(theme)
        db.flush()  # чтобы получить id
    return theme


def get_or_create_association(assoc_data, db):
    assoc = db.query(Association).filter_by(
        name=assoc_data.name,
        description=assoc_data.description,
        reason=assoc_data.reason
    ).first()
    if not assoc:
        assoc = Association(
            name=assoc_data.name,
            description=assoc_data.description,
            reason=assoc_data.reason
        )
        db.add(assoc)
        db.flush()
    return assoc


def write_new_task_to_database(task_data, db):

    # соответствие существующим темам
    match_themes = []
    if task_data.match_themes:
        for theme_data in task_data.match_themes:
            match_themes.append(get_or_create_theme(theme_data, db))

    # добавить новые темы
    new_themes = []
    if task_data.new_themes:
        for theme_data in task_data.new_themes:
            new_themes.append(get_or_create_theme(theme_data, db))

    # классификация по типу действия
    action_type = []
    if task_data.action_type:
        for assoc_data in task_data.action_type:
            action_type.append(get_or_create_association(assoc_data, db))

    # классификация по эмоциональной нагрузке (стресс)
    stress = []
    if task_data.stress:
        for assoc_data in task_data.stress:
            stress.append(get_or_create_association(assoc_data, db))

    # классификация по уровню энергии
    energy_level = []
    if task_data.energy_level:
        for assoc_data in task_data.energy_level:
            energy_level.append(get_or_create_association(assoc_data, db))

    # классификация по состояниям
    db_states = None
    if task_data.states:
        states = task_data.states
        db_states = States()
        for field in ["physical", "intellectual", "emotional", "motivational", "social"]:
            assoc_list = getattr(states, field, None)
            if assoc_list and 0 < len(assoc_list):
                assoc = get_or_create_association(assoc_list[0], db)
                setattr(db_states, f"{field}_id", assoc.id)

    # подзадачи
    subtasks = []
    if task_data.subtasks:
        for sub in task_data.subtasks:
            db_sub = SubTask(
                title=sub.title,
                description=sub.description,
                instruction=sub.instruction,
                continuance=sub.continuance,
                motivation=sub.motivation
            )
            subtasks.append(db_sub)

    # риски невыполнения
    db_risk = None
    if task_data.risk_explanation:
        db_risk = RiskExplanation(
            reason=task_data.risk_explanation.reason,
            proposals=task_data.risk_explanation.proposals
        )

    # Taskchecks (даты)
    taskchecks = []
    if task_data.taskchecks:
        for date_str in task_data.taskchecks:
            db_check = TaskCheck(date=parse_iso_datetime(date_str))
            taskchecks.append(db_check)


    task = Task(
        title=task_data.title,
        description=task_data.description,
        motivation=task_data.motivation,
        risk=task_data.risk,
        impact=task_data.impact,
        deadline= None if task_data.deadline == None else parse_iso_datetime(task_data.deadline),
        activation=parse_iso_datetime(task_data.activation),
        match_themes=match_themes,
        new_themes=new_themes,
        action_type=action_type,
        stress=stress,
        energy_level=energy_level,
        subtasks=subtasks,
        risk_explanation=db_risk,
        states=db_states,
        taskchecks=taskchecks
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task
