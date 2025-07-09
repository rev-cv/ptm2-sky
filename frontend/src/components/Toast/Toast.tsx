import { useAtomValue, toastList } from '@utils/jotai.store';
import './style.scss'

const Toast = () => {
    const toasts = useAtomValue(toastList)

    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <div key={toast.id} className={`toast toast-${toast.variant}`}>
                    <span>{toast.text}</span>
                </div>
            ))}
        </div>
    )
}

export default Toast