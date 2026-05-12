import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createEvent, getEvents } from '../api/events'
import { EventMap } from '../components/EventMap'
import { LoadingSpinner } from '../components/LoadingSpinner'
import type { CreateEventInput } from '../types'

export const EventsListPage = () => {
    const queryClient = useQueryClient()

    const {
        data: events,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['events'],
        queryFn: getEvents,
    })

    const createMutation = useMutation({
        mutationFn: createEvent,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['events'] })
        },
    })

    if (isLoading) {
        return <LoadingSpinner text="Loading events..." />
    }

    if (isError) {
        return (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
                {(error as Error).message}
            </div>
        )
    }

    return (
        <section>
            <div>
                <h2 className="font-display text-2xl font-semibold text-slate-900">
                    Events List
                </h2>
                <p className="mt-1 text-slate-700">
                    Select an event to manage participant search, statuses and capacity.
                </p>
            </div>

            <EventMap
                events={events ?? []}
                onCreateEvent={async (input: CreateEventInput) => {
                    await createMutation.mutateAsync(input)
                }}
            />
        </section>
    )
}
