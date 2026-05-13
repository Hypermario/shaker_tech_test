import type { ParticipantStatus } from '../types'

const statusStyleMap: Record<ParticipantStatus, string> = {
    Registered: 'bg-amber-100 text-amber-900 ring-amber-300',
    Confirmed: 'bg-sky-100 text-sky-900 ring-sky-300',
    Attended: 'bg-emerald-100 text-emerald-900 ring-emerald-300',
    Canceled: 'bg-slate-200 text-slate-700 ring-slate-300',
}

interface StatusBadgeProps {
    status: ParticipantStatus
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${statusStyleMap[status]}`}
        >
            {status}
        </span>
    )
}
