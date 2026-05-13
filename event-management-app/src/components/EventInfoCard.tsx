import type { Event } from '../types'
import { formatDate } from '../utils/formatDate'

interface EventInfoCardProps {
    event: Event
    remainingSpots: number
}

export const EventInfoCard = ({ event, remainingSpots }: EventInfoCardProps) => {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="font-display text-2xl font-semibold text-slate-900">
                {event.name}
            </h2>
            <dl className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                <div>
                    <dt className="font-medium text-slate-900">Date</dt>
                    <dd>{formatDate(event.date)}</dd>
                </div>
                <div>
                    <dt className="font-medium text-slate-900">Ends At</dt>
                    <dd>{formatDate(event.endsAt ?? '')}</dd>
                </div>
                <div>
                    <dt className="font-medium text-slate-900">Location</dt>
                    <dd>{event.location}</dd>
                </div>
                <div>
                    <dt className="font-medium text-slate-900">Capacity</dt>
                    <dd>
                        {event.capacity >= 0 ? event.capacity : 'Unlimited'}
                        {event.capacity >= 0 ? ` (${remainingSpots} spot${remainingSpots === 1 ? '' : 's'} left)` : null}
                    </dd>
                </div>
            </dl>

            {event.description ? (
                <p className="mt-4 rounded-xl bg-slate-100 p-3 text-sm text-slate-700">
                    {event.description}
                </p>
            ) : null}
        </div>
    )
}