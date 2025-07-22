from typing import List, Tuple, Optional, Literal
from pydantic import BaseModel

TypeRiskImpact = Literal[0, 1, 2, 3]

class TypeFilter(BaseModel):
    id: int
    name: str
    desc: str
    type: str