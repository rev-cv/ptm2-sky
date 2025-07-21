
from typing import List, Tuple, Optional
from pydantic import BaseModel

from schemas.types_get_filters import TypeRiskImpact

class TypeQuery(BaseModel):
    id: int
    name: str
    descr: str
    q: str

    infilt: List[int]
    exfilt: List[int]

    crange: Tuple[str, str]
    arange: Tuple[str, str]
    drange: Tuple[str, str]
    irange: Tuple[str, str]

    donerule: str  # "ignore" | "exclude" | "tostart" | "toend"
    failrule: str  # "ignore" | "exclude" | "tostart" | "toend"

    inrisk: List[TypeRiskImpact]
    exrisk: List[TypeRiskImpact]

    inimpact: List[TypeRiskImpact]
    eximpact: List[TypeRiskImpact]

    sort: List[str]

    is_default: bool
    page: Optional[int] = None