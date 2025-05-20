from typing import List, Optional, Literal
from pydantic import BaseModel

class TaskGenerateRequest(BaseModel):
    text: str
    description: Optional[str] = ""

class TypeThemes(BaseModel):
    id: Optional[int] = None
    name: str
    description: Optional[str] = None
    match_percentage: int
    reason: str

class TypeSubTask(BaseModel):
    title: str
    description: str
    instruction: str
    continuance: int
    motivation: str

class TypeAssociation(BaseModel):
    id: int
    title: str
    description: str
    reason: str

class RiskExplanation(BaseModel):
    reason: str
    proposals: str

class States(BaseModel):
    physical: List[TypeAssociation]
    intellectual: List[TypeAssociation]
    emotional: List[TypeAssociation]
    motivational: List[TypeAssociation]
    social: List[TypeAssociation]

class NewTaskRequest(BaseModel):
    title: str
    description: str
    motivation: Optional[str] = None
    match_themes: Optional[List[TypeThemes]] = None
    new_themes: Optional[List[TypeThemes]] = None
    subtasks: Optional[List[TypeSubTask]] = None
    risk: Optional[Literal[0, 1, 2, 3]] = None
    risk_explanation: Optional[RiskExplanation] = None
    impact: Optional[Literal[0, 1, 2, 3]] = None
    states: Optional[States] = None
    action_type: Optional[List[TypeAssociation]] = None
    stress: Optional[List[TypeAssociation]] = None
    energy_level: Optional[List[TypeAssociation]] = None
    deadline: Optional[str] = None
    activation: Optional[str] = None
    taskchecks: Optional[List[str]] = None
    
