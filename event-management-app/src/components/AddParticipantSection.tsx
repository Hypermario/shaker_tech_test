import { ParticipantForm } from './ParticipantForm'

interface AddParticipantSectionProps {
    disabled: boolean
    onCreate: (input: { name: string; email: string }) => Promise<void>
}

export const AddParticipantSection = ({
    disabled,
    onCreate,
}: AddParticipantSectionProps) => {
    return (
        <ParticipantForm disabled={disabled} onCreate={onCreate} />
    )
}