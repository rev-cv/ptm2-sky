from fastapi import HTTPException
from schemas.types_metadata import MetadataResponse
from typing import Optional
import httpx
from bs4 import BeautifulSoup
import re
from urllib.parse import urljoin, urlparse

class MetadataParser:
    def __init__(self):
        self.timeout = httpx.Timeout(10.0)  # 10 секунд таймаут
        
    async def fetch_html(self, url: str) -> str:
        """Получает HTML содержимое страницы"""
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
        
        async with httpx.AsyncClient(timeout=self.timeout, follow_redirects=True) as client:
            try:
                response = await client.get(url, headers=headers)
                response.raise_for_status()
                
                # Проверяем content-type
                content_type = response.headers.get('content-type', '').lower()
                if not any(ct in content_type for ct in ['text/html', 'application/xhtml']):
                    raise ValueError(f"Invalid content type: {content_type}")
                
                return response.text
                
            except httpx.TimeoutException:
                raise HTTPException(status_code=408, detail="Request timeout")
            except httpx.HTTPStatusError as e:
                raise HTTPException(status_code=e.response.status_code, detail=f"HTTP error: {e.response.status_code}")
            except Exception as e:
                # logger.error(f"Error fetching {url}: {str(e)}")
                raise HTTPException(status_code=500, detail=f"Failed to fetch URL: {str(e)}")

    def extract_favicon(self, soup: BeautifulSoup, base_url: str) -> Optional[str]:
        """Извлекает favicon"""
        # Ищем различные варианты favicon
        favicon_selectors = [
            'link[rel="icon"]',
            'link[rel="shortcut icon"]',
            'link[rel="apple-touch-icon"]',
            'link[rel="apple-touch-icon-precomposed"]'
        ]
        
        for selector in favicon_selectors:
            favicon = soup.select_one(selector)
            if favicon and favicon.get('href'):
                href = favicon['href']
                return urljoin(base_url, href)
        
        # Если не найден, пробуем стандартный /favicon.ico
        parsed_url = urlparse(base_url)
        return f"{parsed_url.scheme}://{parsed_url.netloc}/favicon.ico"

    def clean_text(self, text: Optional[str]) -> Optional[str]:
        """Очищает и обрезает текст"""
        if not text:
            return None
        
        # Убираем лишние пробелы и переносы
        text = re.sub(r'\s+', ' ', text.strip())
        
        # Обрезаем до разумной длины
        if len(text) > 300:
            text = text[:297] + "..."
        
        return text if text else None

    def extract_metadata(self, html: str, url: str) -> MetadataResponse:
        """Извлекает метаданные из HTML"""
        soup = BeautifulSoup(html, 'html.parser')
        
        # Извлекаем базовые метаданные
        metadata = {
            'url': url,
            'title': None,
            'description': None,
            'image': None,
            'site_name': None,
            'favicon': None,
            'type': None,
            'author': None,
            'published_time': None
        }
        
        # Title
        title_sources = [
            soup.find('meta', attrs={'property': 'og:title'}),
            soup.find('meta', attrs={'name': 'twitter:title'}),
            soup.find('title'),
            soup.find('h1')
        ]
        for source in title_sources:
            if source:
                if source.name == 'meta':
                    title = source.get('content')
                else:
                    title = source.get_text()
                if title:
                    metadata['title'] = self.clean_text(title)
                    break
        
        # Description
        desc_sources = [
            soup.find('meta', attrs={'property': 'og:description'}),
            soup.find('meta', attrs={'name': 'twitter:description'}),
            soup.find('meta', attrs={'name': 'description'})
        ]
        for source in desc_sources:
            if source and source.get('content'):
                metadata['description'] = self.clean_text(source['content'])
                break
        
        # Image
        img_sources = [
            soup.find('meta', attrs={'property': 'og:image'}),
            soup.find('meta', attrs={'name': 'twitter:image'}),
            soup.find('meta', attrs={'name': 'twitter:image:src'})
        ]
        for source in img_sources:
            if source and source.get('content'):
                img_url = source['content']
                metadata['image'] = urljoin(url, img_url)
                break
        
        # Site name
        site_name = soup.find('meta', attrs={'property': 'og:site_name'})
        if site_name and site_name.get('content'):
            metadata['site_name'] = self.clean_text(site_name['content'])
        else:
            parsed_url = urlparse(url)
            metadata['site_name'] = parsed_url.netloc
        
        # Type
        og_type = soup.find('meta', attrs={'property': 'og:type'})
        if og_type and og_type.get('content'):
            metadata['type'] = og_type['content']
        
        # Author
        author_sources = [
            soup.find('meta', attrs={'name': 'author'}),
            soup.find('meta', attrs={'property': 'article:author'}),
            soup.find('meta', attrs={'name': 'twitter:creator'})
        ]
        for source in author_sources:
            if source and source.get('content'):
                metadata['author'] = self.clean_text(source['content'])
                break
        
        # Published time
        time_sources = [
            soup.find('meta', attrs={'property': 'article:published_time'}),
            soup.find('meta', attrs={'property': 'article:modified_time'}),
            soup.find('time')
        ]
        for source in time_sources:
            if source:
                if source.name == 'meta':
                    time_val = source.get('content')
                else:
                    time_val = source.get('datetime') or source.get_text()
                if time_val:
                    metadata['published_time'] = time_val
                    break
        
        # Favicon
        metadata['favicon'] = self.extract_favicon(soup, url)
        
        return MetadataResponse(**metadata)

    async def parse_url(self, url: str) -> MetadataResponse:
        """Главная функция парсинга URL"""
        try:
            html = await self.fetch_html(url)
            return self.extract_metadata(html, url)
        
        except HTTPException:
            raise
        except Exception as e:
            # logger.error(f"Error parsing {url}: {str(e)}")
            return MetadataResponse(
                url=url,
                error=f"Failed to parse URL: {str(e)}"
            )
