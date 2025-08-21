from fastapi import APIRouter, HTTPException, Query, BackgroundTasks, Body
from schemas.types_metadata import MetadataResponse
from utils.parser_metadata import MetadataParser
from typing import Dict
from urllib.parse import urlparse
import logging
import hashlib
from datetime import datetime, timedelta

router = APIRouter()
parser = MetadataParser()
# простой in-memory кэш (в продакшене - Redis)
cache: Dict[str, tuple[MetadataResponse, datetime]] = {}
CACHE_TTL = timedelta(hours=24)

@router.get("/metadata", response_model=MetadataResponse)
async def get_metadata(url: str = Query(..., description="URL для парсинга")):
   
    try:
        parsed_url = urlparse(url)
        if not parsed_url.scheme or not parsed_url.netloc:
            raise ValueError("Invalid URL format")
        
        normalized_url = f"{parsed_url.scheme}://{parsed_url.netloc}{parsed_url.path}"
        if parsed_url.query:
            normalized_url += f"?{parsed_url.query}"
            
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid URL: {str(e)}")
    
    cache_key = hashlib.md5(url.encode()).hexdigest()
    
    if cache_key in cache:
        cached_data, cached_time = cache[cache_key]
        if datetime.now() - cached_time < CACHE_TTL:
            return cached_data
    
    metadata = await parser.parse_url(normalized_url)
    
    # Сохраняем в кэш
    if not metadata.error:
        cache[cache_key] = (metadata, datetime.now())
    
    return metadata