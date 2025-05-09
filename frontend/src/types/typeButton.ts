export type TypeButtonProps = {
    label?: string
    disabled?: boolean
    variant?: 'icolabel' | 'ico' | 'label' | 'icolabel-s' | 'ico-s' | 'label-s'
    onClick?: React.MouseEventHandler<HTMLButtonElement>
    children?: React.ReactNode
    className?: string
}
