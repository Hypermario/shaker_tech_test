import { useEffect, useRef, useState } from 'react'
import { participantStatuses } from '../types'
import type { Participant, ParticipantStatus } from '../types'
import { StatusBadge } from './StatusBadge'

interface ParticipantsTableProps {
    participants: Participant[]
    onDelete: (participantId: string) => void
    onStatusChange: (
        participant: Participant,
        status: ParticipantStatus,
    ) => Promise<void>
}

export const ParticipantsTable = ({
    participants,
    onDelete,
    onStatusChange,
}: ParticipantsTableProps) => {
    const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
    const confirmContainerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!confirmDeleteId) {
            return
        }

        const handleDocumentClick = (event: MouseEvent) => {
            const target = event.target as Node

            if (
                confirmContainerRef.current &&
                !confirmContainerRef.current.contains(target)
            ) {
                setConfirmDeleteId(null)
            }
        }

        document.addEventListener('click', handleDocumentClick, true)

        return () => {
            document.removeEventListener('click', handleDocumentClick, true)
        }
    }, [confirmDeleteId])

    if (participants.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white/70 px-4 py-8 text-center text-slate-600">
                No participants in this event
            </div>
        )
    }

    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-slate-700">
                    <tr>
                        <th className="px-4 py-3 font-medium">Avatar</th>
                        <th className="px-4 py-3 font-medium">Name</th>
                        <th className="px-4 py-3 font-medium">Email</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                        <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {participants.map((participant) => (
                        <tr key={participant.id} className={confirmDeleteId === participant.id ? 'bg-red-100' : 'hover:bg-slate-50/80'}>
                            <td className="px-4 py-3">
                                {participant.avatar ? (
                                    <img
                                        src={participant.avatar}
                                        alt={participant.name}
                                        className="h-8 w-8 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-slate-300" />
                                )}
                            </td>
                            <td className="px-4 py-3 text-slate-900">{participant.name}</td>
                            <td className="px-4 py-3 text-slate-700">{participant.email}</td>
                            <td className="px-4 py-3">
                                <StatusBadge status={participant.status} />
                            </td>
                            <td className="px-4 py-3">
                                <div className="flex gap-2 justify-between">
                                    <select
                                        className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm text-slate-900"
                                        value={participant.status}
                                        onChange={(event) => {
                                            const nextStatus = event.target
                                                .value as ParticipantStatus
                                            void onStatusChange(participant, nextStatus)
                                        }}
                                    >
                                        {participantStatuses.map((status) => (
                                            <option key={status} value={status}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                    <div
                                        className="relative flex w-40 shrink-0 justify-end"
                                        ref={
                                            confirmDeleteId === participant.id
                                                ? confirmContainerRef
                                                : null
                                        }
                                    >
                                        <button
                                            type="button"
                                            className="rounded-lg border border-rose-200 bg-rose-50 px-2 py-1.5 text-xs font-medium text-rose-700 transition hover:bg-rose-100"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setConfirmDeleteId(participant.id)
                                            }}
                                        >
                                            Remove
                                        </button>
                                        {confirmDeleteId === participant.id ? (
                                            <div className="absolute right-0 top-1/2 z-10 flex -translate-y-1/2 items-center gap-2 rounded-xl bg-white/95 px-2 py-1.5 shadow-lg ring-1 ring-rose-200 backdrop-blur-sm">
                                                <button
                                                    type="button"
                                                    className="rounded-md bg-rose-600 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-rose-700"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        onDelete(participant.id)
                                                        setConfirmDeleteId(null)
                                                    }}
                                                >
                                                    Confirm removal
                                                </button>
                                                <button
                                                    type="button"
                                                    className="rounded-md px-2 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-800"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        setConfirmDeleteId(null)
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
