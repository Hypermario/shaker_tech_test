import type { Participant, ParticipantStatus } from '../types'

const comingStatuses: ReadonlySet<ParticipantStatus> = new Set([
    'Registered',
    'Confirmed',
    'Attended',
])

export const isComingStatus = (status: ParticipantStatus): boolean => {
    return comingStatuses.has(status)
}

export const countComingParticipants = (
    participants: Participant[],
): number => {
    return participants.filter((participant) => isComingStatus(participant.status)).length
}
