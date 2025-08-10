import React, { useEffect, useState } from "react"
import { parseSite } from '@api/parseSite'

const PagePreview: React.FC<{ url: string }> = ({ url }) => {
    const [metadata, setMetadata] = useState<any | null>(null);

    useEffect(() => {
        if (metadata) return

        const fetchMetadata = async () => {
            try {
                const data = await parseSite(url);
                setMetadata(data?.data);
                console.log('Полученные данные:', data);
            } catch (error) {
                console.error('Ошибка при парсинге:', error);
                setMetadata({ error: error }); // Сохраняем ошибку в состоянии
            }
        }
        fetchMetadata()
    }, [url]); // Зависимость от url, чтобы обновлять данные при его изменении

    if (!metadata || metadata.error) {
        return null; // Можно отобразить сообщение об ошибке, если metadata.error
    }

    return (
        <span className="md-site-preview">
            <picture className="md-site-preview__image">
                <img src={metadata?.image} alt="Page preview" className="preview-img" />
            </picture>
            <span className="md-site-preview__title">{metadata?.title}</span>
            <span className="md-site-preview__descr">{metadata?.description}</span>
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="md-site-preview__link"
                onClick={e => e.stopPropagation()}
            ></a>
        </span>
    );
};

export default React.memo(PagePreview)


// title: Optional[str] = None
// description: Optional[str] = None
// image: Optional[str] = None
// site_name: Optional[str] = None
// favicon: Optional[str] = None
// url: str
// type: Optional[str] = None
// author: Optional[str] = None
// published_time: Optional[str] = None
// error: Optional[str] = None