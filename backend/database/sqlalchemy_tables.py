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

assoс__tasks_and_associations = Table(
    'assoс__tasks_and_associations', Base.metadata,
    Column('task_id', Integer, ForeignKey('tasks.id')),
    Column('association_id', Integer, ForeignKey('associations.id'))
)

assoc__queries_infilt_and_filters = Table(
    'assoc__queries_infilt_and_filters', Base.metadata,
    Column('query_id', Integer, ForeignKey('queries.id')),
    Column('filter_id', Integer, ForeignKey('filters.id'))
)

assoc__queries_exfilt_and_filters = Table(
    'assoc__queries_exfilt_and_filters', Base.metadata,
    Column('query_id', Integer, ForeignKey('queries.id')),
    Column('filter_id', Integer, ForeignKey('filters.id'))
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
    filter_id = Column(Integer, ForeignKey('filters.id'), nullable=False)
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
    order = Column(Integer)

class TaskCheck(Base):
    __tablename__ = 'taskchecks'
    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(Integer, ForeignKey('tasks.id'))
    date = Column(DateTime(timezone=True))

class Task(Base):
    __tablename__ = 'tasks'
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)

    created_at = Column(
        DateTime(timezone=True), 
        nullable=False, 
        default=datetime.datetime.now(datetime.timezone.utc)
    )
    activation = Column(DateTime(timezone=True))
    deadline = Column(DateTime(timezone=True))

    status = Column(Boolean, default=False)
    finished_at = Column(DateTime(timezone=True))

    impact = Column(Integer)
    risk = Column(Integer)

    risk_explanation = Column(Text)
    risk_proposals = Column(Text)
    motivation = Column(Text)

    # --- relationships ---
    
    subtasks = relationship("SubTask", backref="task", lazy="joined")
    filters = relationship("Association", backref="task", secondary=assoс__tasks_and_associations, lazy="joined")
    taskchecks = relationship("TaskCheck", backref="task", lazy="joined")

class Queries(Base):
    __tablename__ = 'queries'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    descr = Column(String, default="")
    q = Column(String, default="")

    crange = Column(String, default="__")
    arange = Column(String, default="__")
    drange = Column(String, default="__")
    irange = Column(String, default="__")
    frange = Column(String, default="__")

    donerule = Column(String, default="ignore") # "ignore" | "" | "exclude" | "tostart" | "toend"
    failrule = Column(String, default="ignore") # "ignore" | "" | "exclude" | "tostart" | "toend"
    statusrule = Column(String, default="") # "ignore" | "" | "done" | "fail" | "wait"

    inrisk = Column(String, default="")
    exrisk = Column(String, default="")
    inimpact = Column(String, default="")
    eximpact = Column(String, default="")

    order_by = Column(String, default="")

    infilt = relationship("Filter", 
        secondary=assoc__queries_infilt_and_filters, 
        lazy="joined",
    )
    exfilt = relationship("Filter", 
        secondary=assoc__queries_exfilt_and_filters,
        lazy="joined",
    )

    is_default = Column(Boolean, default=False)

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
    