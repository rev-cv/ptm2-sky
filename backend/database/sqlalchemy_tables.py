from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine, Column, ForeignKey, Table
from sqlalchemy import Integer, String, Text, DateTime, Boolean, Float
from sqlalchemy.orm import relationship, sessionmaker, validates
import datetime

Base = declarative_base()

DATABASE_URL = "sqlite:///example.db"
engine = create_engine(DATABASE_URL, echo=True)  # echo=True для отладки

# --- фабрика сессий ---

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# --- вспомогательные таблицы для ManyToMany ---

task_associations = Table(
    'task_associations', Base.metadata,
    Column('task_id', Integer, ForeignKey('tasks.id')),
    Column('association_id', Integer, ForeignKey('associations.id'))
)

# --- основные таблицы ---

class Filter(Base):
    __tablename__ = 'filters'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    filter_type = Column(String, nullable=False)  # theme, state__physical, state__intellectual, stress, energy_level и т.д.
    description = Column(Text)
    is_user_defined = Column(Boolean, default=False)  # флаг для пользовательских фильтров

class Association(Base):
    __tablename__ = 'associations'
    id = Column(Integer, primary_key=True, index=True)
    filter_id = Column(Integer, ForeignKey('filters.id'))
    reason = Column(Text) # обоснование причины добавления связи с фильтром
    relevance  = Column(Integer) # процент соответствия с фильтром
    proposals = Column(Text) # предложения / рекомендации

    filter = relationship("Filter")

class SubTask(Base):
    __tablename__ = 'subtasks'
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey('tasks.id'))
    status = Column(Boolean, default=False)
    title = Column(String, nullable=False)
    description = Column(Text)
    instruction = Column(Text)
    continuance = Column(Float)
    motivation = Column(Text)

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

    activation = Column(DateTime)
    deadline = Column(DateTime)

    status = Column(Boolean, default=False)

    impact = Column(Integer)
    risk = Column(Integer)

    risk_explanation = Column(Text)
    risk_proposals = Column(Text)
    motivation = Column(Text)

    created_at = Column(DateTime, nullable=False, default=datetime.datetime.now(datetime.timezone.utc))

    # --- relationships ---
    
    subtasks = relationship("SubTask", backref="task", lazy="joined")
    filters = relationship("Association", secondary=task_associations, lazy="joined")
    taskchecks = relationship("TaskCheck", backref="task", lazy="joined")
    
# --- инициализация базы данных ---

def init_db():
    Base.metadata.create_all(bind=engine)

    # --- инициализация фильтров ---

    from database.initial__db import initialize_filters_from_json
    with SessionLocal() as db:
        initialize_filters_from_json(db)


# --- функция получения сессии (для dependency injection) ---

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
    