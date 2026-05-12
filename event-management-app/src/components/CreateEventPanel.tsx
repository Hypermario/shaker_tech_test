import { useMemo, useState, type FormEvent } from 'react'
import { NotificationToast } from './NotificationToast'
import type { CreateEventInput } from '../types'

interface CreateEventPanelProps {
    onCreate: (input: CreateEventInput) => Promise<void>
}

export const CreateEventPanel = ({ onCreate }: CreateEventPanelProps) => {
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [createError, setCreateError] = useState<string | null>(null)
    const [eventName, setEventName] = useState('')
    const [startsAt, setStartsAt] = useState('')
    const [endsAt, setEndsAt] = useState('')
    const [location, setLocation] = useState('')
    const [capacity, setCapacity] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const canSubmit = useMemo(() => {
        return (
            eventName.trim().length > 0 &&
            startsAt.length > 0 &&
            endsAt.length > 0 &&
            location.trim().length > 0 &&
            Number(capacity) >= 0 &&
            !isSubmitting
        )
    }, [capacity, endsAt, eventName, isSubmitting, location, startsAt])

    const resetForm = () => {
        setEventName('')
        setStartsAt('')
        setEndsAt('')
        setLocation('')
        setCapacity('')
    }

    const closePanel = () => {
        setIsCreateOpen(false)
        setCreateError(null)
    }

    const handleCreate = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()

        const startTimestamp = Math.floor(new Date(startsAt).getTime() / 1000)
        const endTimestamp = Math.floor(new Date(endsAt).getTime() / 1000)

        if (!Number.isFinite(startTimestamp) || !Number.isFinite(endTimestamp)) {
            setCreateError('Please enter valid start and end dates.')
            return
        }

        setCreateError(null)
        setIsSubmitting(true)

        try {
            await onCreate({
                name: eventName,
                startsAt: startTimestamp,
                endsAt: endTimestamp,
                location,
                capacity: Number(capacity),
            })
            resetForm()
            setIsCreateOpen(false)
        } catch (unknownError) {
            if (unknownError instanceof Error) {
                setCreateError(unknownError.message)
            } else {
                setCreateError('Failed to create event')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <button
                type="button"
                className="group flex h-full min-h-[12rem] flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white/90 p-5 text-slate-400 shadow-sm transition hover:-translate-y-0.5 hover:border-red-300 hover:bg-white/90 hover:shadow-md hover:text-red-600"
                onClick={() => setIsCreateOpen(true)}
            >
                <span className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-current text-5xl font-light leading-none transition group-hover:border-red-600">
                    +
                </span>
            </button>

            {isCreateOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 py-8 backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h3 className="font-display text-2xl font-semibold text-slate-900">
                                    Create event
                                </h3>
                                <p className="mt-1 text-sm text-slate-600">
                                    Fill the details and add the event to the list.
                                </p>
                            </div>
                            <button
                                type="button"
                                className="rounded-full px-3 py-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                                onClick={closePanel}
                            >
                                Close
                            </button>
                        </div>

                        <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={handleCreate}>
                            <label className="grid gap-1 text-sm text-slate-700 sm:col-span-2">
                                Event name
                                <input
                                    className="rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-red-500"
                                    value={eventName}
                                    onChange={(e) => setEventName(e.target.value)}
                                    placeholder="Morning Yoga"
                                />
                            </label>

                            <label className="grid gap-1 text-sm text-slate-700">
                                Starts at
                                <input
                                    type="datetime-local"
                                    className="rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-red-500"
                                    value={startsAt}
                                    onChange={(e) => setStartsAt(e.target.value)}
                                />
                            </label>

                            <label className="grid gap-1 text-sm text-slate-700">
                                Ends at
                                <input
                                    type="datetime-local"
                                    className="rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-red-500"
                                    value={endsAt}
                                    onChange={(e) => setEndsAt(e.target.value)}
                                />
                            </label>

                            <label className="grid gap-1 text-sm text-slate-700">
                                Location
                                <input
                                    className="rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-red-500"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    placeholder="Paris"
                                />
                            </label>

                            <label className="grid gap-1 text-sm text-slate-700">
                                Capacity
                                <input
                                    type="number"
                                    min="0"
                                    className="rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-red-500"
                                    value={capacity}
                                    onChange={(e) => setCapacity(e.target.value)}
                                    placeholder="20"
                                />
                            </label>

                            <div className="flex items-center justify-end gap-3 sm:col-span-2">
                                <button
                                    type="button"
                                    className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                                    onClick={closePanel}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!canSubmit}
                                    className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                                >
                                    {isSubmitting ? 'Creating...' : 'Create event'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : null}

            {createError ? (
                <NotificationToast
                    message={createError}
                    isVisible={Boolean(createError)}
                    onDismiss={() => setCreateError(null)}
                />
            ) : null}
        </>
    )
}