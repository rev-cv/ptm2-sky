import { atom, getDefaultStore } from 'jotai'

type TypeToastVariants = "loader" | "save" | 'delete'

type TypeToast = {
    id: number
    text: string
    variant?: TypeToastVariants
}

export const toastList = atom<TypeToast[]>([
    // {id: 1, text: "text text text vtext", variant: "save"}
])

export const addToast = (text: string, variant: TypeToastVariants = 'save') => {
    const id = Date.now() // ID на основе времени
    const store = getDefaultStore()
    const toasts = store.get(toastList)

    store.set(toastList, [...toasts, { id, text, variant }])

    // таймер для автоматического удаления (кроме loader)
    if (variant !== 'loader') {
        setTimeout(() => {
            store.set(toastList, toasts.filter((toast) => toast.id !== id))
        }, 3000)
    }
};