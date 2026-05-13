const parseDate = (value: string): Date | null => {
    const trimmedValue = value.trim()

    if (!trimmedValue) {
        return null
    }

    const asNumber = Number(trimmedValue)
    const date = Number.isFinite(asNumber)
        ? new Date(trimmedValue.length <= 10 ? asNumber * 1000 : asNumber)
        : new Date(trimmedValue)

    if (Number.isNaN(date.getTime())) {
        return null
    }

    return date
}

export const formatDate = (value: string): string => {
    const date = parseDate(value)

    if (!date) {
        return 'Date TBD'
    }

    return new Intl.DateTimeFormat('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(date)
}
