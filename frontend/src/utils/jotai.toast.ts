import { atom, getDefaultStore } from 'jotai'

type TypeToastVariants = "loader" | "save" | 'delete' | 'gen'

type TypeToast = {
    id: number
    text: string
    variant?: TypeToastVariants
}

export const toastList = atom<TypeToast[]>([
    // {id: -100, text: "text text text vtext", variant: "gen"}
])

export const addToast = (text: string, variant: TypeToastVariants = 'save') => {
    const id = Date.now() // ID на основе времени
    const store = getDefaultStore()

    store.set(toastList, prev => [...prev, { id, text, variant }])

    // таймер для автоматического удаления (кроме loader)
    if (variant !== 'loader') {
        setTimeout(() => {
            store.set(toastList, store.get(toastList).filter((toast) => 
                toast.id !== id || Date.now() - toast.id < 3000
            ))
        }, 3000)
    }
}

export const startToastGen = (text:string) => {
    // может быть только один toast варианта gen
    const store = getDefaultStore()
    const tl = store.get(toastList).find(toast => (toast.id === -100))
    store.set(toastList, prev => (
        tl ? prev.map(toast => toast.id === -100 ? {id:-100, text, variant:"gen"} : toast) :
        [...prev, { id:-100, text, variant:"gen" }]
    ))
}

export const stopToastGen = () => {
    const store = getDefaultStore()
    store.set(toastList, prev => prev.filter(toast => 0 < toast.id))
}