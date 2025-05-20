export type TypeButtonProps = {
    text?: string | null
    IconComponent?: string | null | React.FunctionComponent<React.SVGProps<SVGSVGElement>> | React.ComponentType<React.SVGProps<SVGSVGElement>>
    className?: string | null
    variant?: 'first' | 'second'
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
    disabled?: boolean
}
