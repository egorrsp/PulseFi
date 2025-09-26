interface ReturnButtonProps {
    onReturn: () => void;
}

export const ReturnButton: React.FC<ReturnButtonProps> = ({ onReturn }) => {
    return (
        <button
            className="px-3 py-1 border-2 rounded-md cursor-pointer border-red-500 text-red-500 uppercase text-2xl active:shadow-md"
            onClick={() => onReturn()}
        >
            Return
        </button>
    )
}