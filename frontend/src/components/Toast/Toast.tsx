import './style.scss'
import { useAtomValue, toastList } from '@utils/jotai.store';
import LoaderGen from '@comps/Loader/LoaderGen';

const Toast = () => {
    const toasts = useAtomValue(toastList)

    return (
        <div className="toast-container">
            {toasts.map(toast => {
                if (toast.variant != "gen") {
                    return <div key={`toast-#${toast.id}`} className={`toast toast-${toast.variant}`}>
                        <span>{toast.text}</span>
                    </div>
                } else {
                    return <div key={`toast-#${toast.id}`} className={`toast-${toast.variant}`}>
                        <LoaderGen />
                        <span>{toast.text}</span>
                    </div>
                }
            })}
        </div>
    )
}

export default Toast