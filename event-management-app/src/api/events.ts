import { EVENTS_API, fetchJson, ApiError } from './http'
import type { CreateEventInput, Event } from '../types'

interface RawEvent {
    id: string
    name?: string
    startsAt?: number | string
    endsAt?: number | string
    date?: string
    location?: string
    capacity?: number | string
    description?: string
}

const toEventRecord = (raw: RawEvent): Event => {
    const parsedCapacity = Number(raw.capacity)

    return {
        id: String(raw.id),
        name: raw.name?.trim() || 'Untitled event',
        date: String(raw.startsAt ?? raw.date ?? ''),
        endsAt: raw.endsAt !== undefined ? String(raw.endsAt) : undefined,
        location: raw.location?.trim() || 'Unknown location',
        capacity: Number.isFinite(parsedCapacity) && parsedCapacity >= 0 ? parsedCapacity : -1, // normalize negative values to -1 to indicate unlimited capacity
        description: raw.description,
    }
}

export const getEvents = async (): Promise<Event[]> => {
    try {
        const data = await fetchJson<RawEvent[]>(EVENTS_API)
        return data.map(toEventRecord)
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
            return []
        }

        throw error
    }
}

export const getEvent = async (eventId: string): Promise<Event> => {
    const data = await fetchJson<RawEvent>(`${EVENTS_API}/${eventId}`)
    return toEventRecord(data)
}

export const createEvent = async (
    input: CreateEventInput,
): Promise<Event> => {
    const payload = {
        name: input.name.trim(),
        startsAt: input.startsAt,
        endsAt: input.endsAt,
        location: input.location.trim(),
        capacity: input.capacity,
    }

    const data = await fetchJson<RawEvent>(EVENTS_API, {
        method: 'POST',
        body: JSON.stringify(payload),
    })

    return toEventRecord(data)
}
