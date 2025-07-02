from typing import Optional, List, Dict, Any
from typing import List, Optional, Literal
from pydantic import BaseModel
from datetime import datetime

class TypeSubTask(BaseModel):
    id: int
    status: bool
    title: str
    description: str
    instruction: str
    motivation: str
    continuance: float
    order: int

class TypeFilter(BaseModel):
    id: int
    idf: int # ассоциация с фильтром (нужно если id === -1, т.е. ассоциация еще не создана)
    reason: str

class TypeTask(BaseModel):
    id: int
    status: Optional[bool] = None
    title: Optional[str] = None
    description: Optional[str] = None
    motivation: Optional[str] = None

    risk: Optional[Literal[0, 1, 2, 3]] = None
    risk_explanation: Optional[str] = None
    risk_proposals: Optional[str] = None
    impact: Optional[Literal[0, 1, 2, 3]] = None

    subtasks: Optional[List[TypeSubTask]] = None
    filter_list: Optional[List[TypeFilter]] = None

    deadline: Optional[str] = None
    activation: Optional[str] = None
    taskchecks: Optional[List[str]] = None
