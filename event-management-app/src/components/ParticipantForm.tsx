import { useMemo, useState, type SyntheticEvent } from 'react'
import { NotificationToast } from './NotificationToast'

interface ParticipantFormProps {
    disabled: boolean
    onCreate: (input: { name: string; email: string }) => Promise<void>
}

export const ParticipantForm = ({
    disabled,
    onCreate,
}: ParticipantFormProps) => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const isFormValid = useMemo(() => {
        return name.trim().length > 0 && email.trim().length > 0
    }, [email, name])

    const handleSubmit = async (event: SyntheticEvent<HTMLFormElement, SubmitEvent>) => {
        event.preventDefault()

        if (!isFormValid || disabled) {
            return
        }

        setError(null)
        setIsSubmitting(true)

        try {
            await onCreate({ name: name.trim(), email: email.trim() })
            setName('')
            setEmail('')
        } catch (unknownError) {
            if (unknownError instanceof Error) {
                setError(unknownError.message)
            } else {
                setError('Unable to create participant.')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            onSubmit={handleSubmit}
        >
            <h3 className="font-display text-lg font-semibold text-slate-900">
                Add Participant
            </h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="text-sm text-slate-700">
                    Name
                    <input
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-red-500"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Alain Dupond"
                    />
                </label>

                <label className="text-sm text-slate-700">
                    Email
                    <input
                        className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-red-500"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="alain.dupond@example.com"
                        type="email"
                    />
                </label>
            </div>

            <div className="mt-3 flex items-center gap-3">
                <button
                    type="submit"
                    disabled={disabled || isSubmitting || !isFormValid}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                    {isSubmitting ? 'Creating...' : disabled ? 'Event Full' : 'Add Participant'}
                </button>
            </div>

            {error ? (
                <NotificationToast
                    message={error}
                    isVisible={Boolean(error)}
                    onDismiss={() => setError(null)}
                />
            ) : null}
        </form>
    )
}
