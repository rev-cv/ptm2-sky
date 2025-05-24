from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine, Column, ForeignKey, Table
from sqlalchemy import Integer, String, Text, DateTime, Boolean, Float
from sqlalchemy.orm import relationship, sessionmaker, validates
import datetime

Base = declarative_base()

DATABASE_URL = "sqlite:///example2.db"
engine = create_engine(DATABASE_URL, echo=True)  # echo=True для отладки

# фабрика сессий
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# --- Вспомогательные таблицы для ManyToMany ---
task_match_themes = Table(
    'task_match_themes', Base.metadata,
    Column('task_id', Integer, ForeignKey('tasks.id')),
    Column('theme_id', Integer, ForeignKey('themes.id'))
)

task_new_themes = Table(
    'task_new_themes', Base.metadata,
    Column('task_id', Integer, ForeignKey('tasks.id')),
    Column('theme_id', Integer, ForeignKey('themes.id'))
)

task_action_types = Table(
    'task_action_types', Base.metadata,
    Column('task_id', Integer, ForeignKey('tasks.id')),
    Column('association_id', Integer, ForeignKey('associations.id'))
)

task_stress = Table(
    'task_stress', Base.metadata,
    Column('task_id', Integer, ForeignKey('tasks.id')),
    Column('association_id', Integer, ForeignKey('associations.id'))
)

task_energy_level = Table(
    'task_energy_level', Base.metadata,
    Column('task_id', Integer, ForeignKey('tasks.id')),
    Column('association_id', Integer, ForeignKey('associations.id'))
)

# --- Основные таблицы ---

class Theme(Base):
    __tablename__ = 'themes'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    match_percentage = Column(Integer)
    reason = Column(Text)

class Association(Base):
    __tablename__ = 'associations'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    reason = Column(Text)

class SubTask(Base):
    __tablename__ = 'subtasks'
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey('tasks.id'))
    title = Column(String, nullable=False)
    description = Column(Text)
    instruction = Column(Text)
    continuance = Column(Float)
    motivation = Column(Text)

class RiskExplanation(Base):
    __tablename__ = 'risk_explanations'
    id = Column(Integer, primary_key=True, index=True)
    reason = Column(Text)
    proposals = Column(Text)
    task_id = Column(Integer, ForeignKey('tasks.id'))

class States(Base):
    __tablename__ = 'states'
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey('tasks.id'))
    # Связи с associations через отдельные таблицы
    physical_id = Column(Integer, ForeignKey('associations.id'))
    intellectual_id = Column(Integer, ForeignKey('associations.id'))
    emotional_id = Column(Integer, ForeignKey('associations.id'))
    motivational_id = Column(Integer, ForeignKey('associations.id'))
    social_id = Column(Integer, ForeignKey('associations.id'))

class TaskCheck(Base):
    __tablename__ = 'taskchecks'
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey('tasks.id'))
    date = Column(DateTime)

class Task(Base):
    __tablename__ = 'tasks'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    motivation = Column(Text)

    risk = Column(Integer)
    impact = Column(Integer)
    deadline = Column(DateTime)
    activation = Column(DateTime)

    # --- Relationships ---
    match_themes = relationship("Theme", secondary=task_match_themes)
    new_themes = relationship("Theme", secondary=task_new_themes)
    subtasks = relationship("SubTask", backref="task")
    risk_explanation = relationship("RiskExplanation", uselist=False, backref="task")
    states = relationship("States", uselist=False, backref="task")
    action_type = relationship("Association", secondary=task_action_types)
    stress = relationship("Association", secondary=task_stress)
    energy_level = relationship("Association", secondary=task_energy_level)
    taskchecks = relationship("TaskCheck", backref="task")

    created_at = Column(DateTime, nullable=False, default=datetime.datetime.now(datetime.timezone.utc))


def init_db():
    Base.metadata.create_all(bind=engine)

# функция получения сессии (для dependency injection)
def get_db():
    '''
    get_db — это dependency, которая подключается к каждому endpoint через Depends.

    Она создает новую сессию для каждого запроса, а после завершения запроса сессия гарантированно закрывается (даже если возникла ошибка).

    Это предотвращает утечки соединений и гарантирует, что каждый запрос работает с "чистой" сессией.
    '''
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
    