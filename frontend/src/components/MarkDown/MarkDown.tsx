import './style.scss'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// import PagePreview from './PagePreview'

type TypeProps = {
    className?: string
    markdown: string
}

function MarkDown ({markdown, className}:TypeProps) {

    return <div className={className ? `${className} md` : "md"}>
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                // кастомная ссылка
                a: ({ node, children, ...props }) => {
                    return <a
                        {...props}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (props.onClick) props.onClick(e);
                        }}
                        >{children}
                    </a>
                },

                img: ({ node, src, ...props }) => {
                    const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(src ? src : "");
                    if (isImage) return <picture><img src={src} {...props} /></picture>
                    if (src) {
                        // return <PagePreview url={src} />
                    }
                    return null
                },
            }}
            >{markdown.trim()}
        </ReactMarkdown>
    </div>
}

export default MarkDown

