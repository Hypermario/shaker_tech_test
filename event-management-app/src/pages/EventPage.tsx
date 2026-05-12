import { useEffect, useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { ApiError } from '../api/http'
import { getEvent } from '../api/events'
import {
    createParticipant,
    deleteParticipant,
    getParticipantsByEvent,
    updateParticipantStatus,
} from '../api/participants'
import { DeleteErrorNotification } from '../components/NotificationToast'
import { EventInfoCard } from '../components/EventInfoCard'
import { LoadingSpinner } from '../components/LoadingSpinner'
import { ParticipantForm } from '../components/ParticipantForm'
import { ParticipantSearchBar } from '../components/ParticipantSearchBar'
import { ParticipantsTable } from '../components/ParticipantsTable'
import { countComingParticipants, isComingStatus } from '../lib/businessRules'
import type { Participant, ParticipantStatus } from '../types'


export const EventPage = () => {
    const { eventId } = useParams<{ eventId: string }>()
    const queryClient = useQueryClient()
    const [searchTerm, setSearchTerm] = useState('')
    const [deleteError, setDeleteError] = useState<string | null>(null)
    const [showError, setShowError] = useState(false)

    const safeEventId = eventId ?? ''

    useEffect(() => {
        if (!deleteError) {
            return
        }

        setShowError(true)
        const timer = setTimeout(() => {
            setShowError(false)
            const fadeTimer = setTimeout(() => {
                setDeleteError(null)
            }, 300)
            return () => clearTimeout(fadeTimer)
        }, 10000)

        return () => clearTimeout(timer)
    }, [deleteError])

    const eventQuery = useQuery({
        queryKey: ['event', safeEventId],
        queryFn: () => getEvent(safeEventId),
        enabled: Boolean(safeEventId),
    })

    const participantsQuery = useQuery({
        queryKey: ['participants', safeEventId],
        queryFn: () => getParticipantsByEvent(safeEventId),
        enabled: Boolean(safeEventId),
    })

    const createMutation = useMutation({
        mutationFn: createParticipant,
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['participants', safeEventId],
            })
        },
    })

    const statusMutation = useMutation({
        mutationFn: ({
            participantId,
            status,
        }: {
            participantId: string
            status: ParticipantStatus
        }) => updateParticipantStatus(participantId, status),
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ['participants', safeEventId],
            })
        },
    })

    const deleteMutation = useMutation({
        mutationFn: deleteParticipant,
        onSuccess: async () => {
            setDeleteError(null)
            await queryClient.invalidateQueries({
                queryKey: ['participants', safeEventId],
            })
        },
        onError: (error) => {
            const message = `Failed to delete participant: please try again later. ${error instanceof ApiError ? `(Error: ${error.status})` : ''}`
            console.error('Delete mutation error:', error)
            setDeleteError(message)
        },
    })

    const participants = participantsQuery.data
    const hasParticipants = (participants?.length ?? 0) > 0

    const filteredParticipants = useMemo(() => {
        const lowerSearch = searchTerm.trim().toLowerCase()

        if (!lowerSearch) {
            return participants ?? []
        }

        return (participants ?? []).filter((participant) => {
            return (
                participant.name.toLowerCase().includes(lowerSearch) ||
                participant.email.toLowerCase().includes(lowerSearch)
            )
        })
    }, [participants, searchTerm])

    const comingCount = countComingParticipants(participants ?? [])
    const eventCapacity = eventQuery.data?.capacity ?? -1
    const remainingSpots = eventCapacity >= 0 ? Math.max(eventCapacity - comingCount, 0) : -1

    const canCreateParticipant = Boolean(
        eventQuery.data && remainingSpots > 0 && !createMutation.isPending,
    )

    const handleCreateParticipant = async (input: {
        name: string
        email: string
    }): Promise<void> => {
        if (!eventQuery.data) {
            throw new Error('Event is not loaded.')
        }

        if (remainingSpots <= 0) {
            throw new Error('Event capacity reached. Cancel someone before adding.')
        }

        await createMutation.mutateAsync({
            eventId: eventQuery.data.id,
            name: input.name,
            email: input.email,
        })
    }

    const handleStatusChange = async (
        participant: Participant,
        nextStatus: ParticipantStatus,
    ): Promise<void> => {
        if (participant.status === nextStatus) {
            return
        }

        const currentlyComing = isComingStatus(participant.status)
        const willBeComing = isComingStatus(nextStatus)

        if (!currentlyComing && willBeComing && comingCount >= eventCapacity) {
            window.alert('Cannot move to a coming status because capacity is full.')
            return
        }

        await statusMutation.mutateAsync({
            participantId: participant.id,
            status: nextStatus,
        })
    }

    const handleDelete = (participantId: string): void => {
        console.log('Attempting to delete participant:', participantId)
        void deleteMutation.mutateAsync(participantId)
    }

    if (!safeEventId) {
        return (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
                Missing event id.
            </div>
        )
    }

    if (eventQuery.isLoading || participantsQuery.isLoading) {
        return <LoadingSpinner text="Loading event data..." />
    }

    if (eventQuery.isError) {
        return (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
                {(eventQuery.error as Error).message}
            </div>
        )
    }

    if (participantsQuery.isError) {
        return (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
                {(participantsQuery.error as Error).message}
            </div>
        )
    }

    const event = eventQuery.data

    if (!event) {
        return (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
                Event not found.
            </div>
        )
    }

    return (
        <section className="space-y-5">
            <Link
                to="/"
                className="inline-flex items-center rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 transition hover:border-red-600 hover:text-red-600"
            >
                ← Back to events
            </Link>

            <EventInfoCard event={event} remainingSpots={remainingSpots} />

            <ParticipantForm
                disabled={!canCreateParticipant}
                onCreate={handleCreateParticipant}
            />

            {hasParticipants ? (
                <ParticipantSearchBar value={searchTerm} onChange={setSearchTerm} />
            ) : null}

            {deleteError && (
                <DeleteErrorNotification
                    message={deleteError}
                    isVisible={showError}
                    onDismiss={() => {
                        setShowError(false)
                        setTimeout(() => setDeleteError(null), 300)
                    }}
                />
            )}

            <ParticipantsTable
                participants={filteredParticipants}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
            />
        </section>
    )
}
