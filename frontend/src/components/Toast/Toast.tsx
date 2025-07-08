import { useAtom, toastList } from '@utils/jotai.store';
import './style.scss'

const Toast = () => {
    const [toasts, updateToasts] = useAtom(toastList)

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