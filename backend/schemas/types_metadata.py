from typing import List, Tuple, Optional, Literal
from pydantic import BaseModel

class MetadataResponse(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image: Optional[str] = None
    site_name: Optional[str] = None
    favicon: Optional[str] = None
    url: str
    type: Optional[str] = None
    author: Optional[str] = None
    published_time: Optional[str] = None
    error: Optional[str] = None
