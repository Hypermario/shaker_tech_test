import { ApiError, PARTICIPANTS_API, fetchJson } from './http'
import type {
    CreateParticipantInput,
    Participant,
    ParticipantStatus,
} from '../types'

interface RawParticipant {
    id: string
    eventId?: string | number
    name?: string
    email?: string
    status?: string
    avatar?: string
    birthdate?: string
    createdAt?: string
}

const normalizeStatus = (status: string | undefined): ParticipantStatus => {
    const normalized = status?.toLowerCase()
    switch (normalized) {
        case 'registered':
            return 'Registered'
        case 'confirmed':
            return 'Confirmed'
        case 'attended':
            return 'Attended'
        case 'canceled':
            return 'Canceled'
        default:
            return 'Registered'
    }
}

const toParticipantRecord = (raw: RawParticipant): Participant => {
    return {
        id: String(raw.id),
        eventId: String(raw.eventId ?? ''),
        name: raw.name?.trim() || 'Unknown participant',
        email: raw.email?.trim() || 'unknown@example.com',
        status: normalizeStatus(raw.status),
        avatar: raw.avatar,
        birthdate: raw.birthdate,
        createdAt: raw.createdAt,
    }
}

export const getParticipantsByEvent = async (
    eventId: string,
): Promise<Participant[]> => {
    const encodedEventId = encodeURIComponent(eventId)
    try {
        const data = await fetchJson<RawParticipant[]>(
            `${PARTICIPANTS_API}?eventId=${encodedEventId}`,
        )

        return data
            .map(toParticipantRecord)
            .filter((participant) => participant.eventId === eventId)
    } catch (error) {
        if (error instanceof ApiError && error.status === 404) {
            return []
        }

        throw error
    }
}

export const createParticipant = async (
    input: CreateParticipantInput,
): Promise<Participant> => {
    const payload = {
        ...input,
        status: 'Registered',
    }

    const data = await fetchJson<RawParticipant>(PARTICIPANTS_API, {
        method: 'POST',
        body: JSON.stringify(payload),
    })

    return toParticipantRecord(data)
}

export const updateParticipantStatus = async (
    participantId: string,
    status: ParticipantStatus,
): Promise<Participant> => {
    const data = await fetchJson<RawParticipant>(
        `${PARTICIPANTS_API}/${participantId}`,
        {
            method: 'PUT',
            body: JSON.stringify({ status }),
        },
    )

    return toParticipantRecord(data)
}

export const deleteParticipant = async (participantId: string): Promise<void> => {
    console.log('DELETE request to:', `${PARTICIPANTS_API}/${participantId}`)
    try {
        await fetchJson(`${PARTICIPANTS_API}/${participantId}`, {
            method: 'DELETE',
        })
        console.log('DELETE successful for participant:', participantId)
    } catch (error) {
        console.error('DELETE failed for participant:', participantId, error)
        throw error
    }
}
