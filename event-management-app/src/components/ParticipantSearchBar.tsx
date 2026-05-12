interface ParticipantSearchBarProps {
    value: string
    onChange: (value: string) => void
}

export const ParticipantSearchBar = ({
    value,
    onChange,
}: ParticipantSearchBarProps) => {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="text-sm text-slate-700">
                Search participants
                <input
                    className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 text-slate-900 outline-none transition focus:border-red-500"
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder="Search by name or email"
                />
            </label>
        </div>
    )
}