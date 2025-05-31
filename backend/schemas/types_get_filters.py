# schemas/types_new_task.py

from typing import List, Optional, Tuple, Literal
from pydantic import BaseModel

# class TypeFilter(BaseModel):
#     type: str
#     id: int
#     value: str
#     type_title: str

TypeDatePeriods = Tuple[Optional[str], Optional[str]]
TypeRiskImpact = Literal[0, 1, 2, 3]

class TypeSearchPanel(BaseModel):
    text: str
    filters: List[int]
    lastOpenedPage: int
    sorted: str
    activation: TypeDatePeriods
    deadline: TypeDatePeriods
    taskchecks: TypeDatePeriods
    risk: List[TypeRiskImpact]
    impact: List[TypeRiskImpact]