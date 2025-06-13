export type TypeButtonProps = {
    text?: string | null
    title?: string
    IconComponent?: string | null | React.FunctionComponent<React.SVGProps<SVGSVGElement>> | React.ComponentType<React.SVGProps<SVGSVGElement>>
    className?: string | null
    variant?: 'first' | 'second' | 'transparent' | 'remove'
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
    disabled?: boolean
}
