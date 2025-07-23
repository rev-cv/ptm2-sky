
from typing import List, Tuple, Optional
from pydantic import BaseModel

from schemas.types_filters import TypeRiskImpact

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
    frange: Tuple[str, str]

    donerule: str  # "ignore" | "exclude" | "tostart" | "toend"
    failrule: str  # "ignore" | "exclude" | "tostart" | "toend"
    statusrule: List[str]

    inrisk: List[TypeRiskImpact]
    exrisk: List[TypeRiskImpact]

    inimpact: List[TypeRiskImpact]
    eximpact: List[TypeRiskImpact]

    order_by: List[str]

    is_default: bool

    # поля заполняемые непосредственно при отправке запроса
    page: Optional[int] = None
    tz: Optional[int] = 0 # смещение часового пояса в минутах