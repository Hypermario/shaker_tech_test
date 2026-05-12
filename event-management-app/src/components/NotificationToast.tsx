interface NotificationToastProps {
    message: string
    isVisible: boolean
    onDismiss: () => void
}

export const NotificationToast = ({
    message,
    isVisible,
    onDismiss,
}: NotificationToastProps) => {
    return (
        <div
            className={`fixed right-5 top-5 z-50 max-w-sm rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-700 shadow-lg transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        >
            <p className="font-medium">{message}</p>
            <button
                type="button"
                className="mt-2 text-xs text-rose-600 underline hover:text-rose-700"
                onClick={onDismiss}
            >
                Dismiss
            </button>
        </div>
    )
}

export const DeleteErrorNotification = NotificationToast