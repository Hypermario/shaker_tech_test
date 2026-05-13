import { Link } from 'react-router-dom'
import { CreateEventPanel } from './CreateEventPanel'
import { formatDate } from '../utils/formatDate'
import type { CreateEventInput, Event } from '../types'

interface EventMapProps {
    events: Event[]
    onCreateEvent: (input: CreateEventInput) => Promise<void>
}

export const EventMap = ({ events, onCreateEvent }: EventMapProps) => {
    return (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
                <Link
                    to={`/events/${event.id}`}
                    key={event.id}
                    className="group rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-red-300 hover:shadow-md"
                >
                    <div className="flex items-start justify-between gap-4">
                        <h3 className="font-display text-xl font-semibold text-slate-900">
                            {event.name}
                        </h3>
                        <span className="rounded-full bg-red-200 px-2.5 py-1 text-xs font-semibold text-red-800">
                            Capacity {event.capacity >= 0 ? event.capacity : 'Unlimited'}
                        </span>
                    </div>
                    <dl className="mt-4 space-y-2 text-sm text-slate-700">
                        <div className="flex gap-2">
                            <dt className="font-medium text-slate-900">Date:</dt>
                            <dd>{formatDate(event.date)}</dd>
                        </div>
                        <div className="flex gap-2">
                            <dt className="font-medium text-slate-900">Location:</dt>
                            <dd>{event.location}</dd>
                        </div>
                    </dl>
                    <span className="mt-5 inline-flex items-center text-sm font-medium text-red-700 group-hover:text-red-900">
                        Open event
                    </span>
                </Link>
            ))}

            <CreateEventPanel onCreate={onCreateEvent} />
        </div>
    )
}