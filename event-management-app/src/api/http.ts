const EVENTS_API =
    'https://69fee13c8c70b15fa3cacf74.mockapi.io/api/events'
const PARTICIPANTS_API =
    'https://69fee13c8c70b15fa3cacf74.mockapi.io/api/participants'

export { EVENTS_API, PARTICIPANTS_API }

export class ApiError extends Error {
    public readonly status: number

    constructor(message: string, status: number) {
        super(message)
        this.name = 'ApiError'
        this.status = status
    }
}

export const fetchJson = async <T>(
    input: RequestInfo,
    init?: RequestInit,
): Promise<T> => {
    const response = await fetch(input, {
        headers: {
            'Content-Type': 'application/json',
            ...(init?.headers ?? {}),
        },
        ...init,
    })

    if (!response.ok) {
        throw new ApiError(
            `Request failed with status ${response.status}`,
            response.status,
        )
    }

    if (response.status === 204) {
        return null as T
    }

    return (await response.json()) as T
}
