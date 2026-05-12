interface LoadingSpinnerProps {
    text: string
}

export const LoadingSpinner = ({ text }: LoadingSpinnerProps) => {
    return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-white px-8 py-10 shadow-sm">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-red-600" />
                <p className="text-sm font-medium text-slate-600">{text}</p>
            </div>
        </div>
    )
}