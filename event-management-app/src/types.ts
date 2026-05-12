export const participantStatuses = [
    'Registered',
    'Confirmed',
    'Attended',
    'Canceled',
] as const

export type ParticipantStatus = (typeof participantStatuses)[number]

export interface Event {
    id: string
    name: string
    date: string
    endsAt?: string
    location: string
    capacity: number
    description?: string
}

export interface CreateEventInput {
    name: string
    startsAt: number
    endsAt: number
    location: string
    capacity: number
}

export interface Participant {
    id: string
    eventId: string
    name: string
    email: string
    status: ParticipantStatus
    avatar?: string
    birthdate?: string
    createdAt?: string
}

export interface CreateParticipantInput {
    eventId: string
    name: string
    email: string
}
