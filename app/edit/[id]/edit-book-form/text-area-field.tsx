'use client';

interface TextAreaFieldProps {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({ id, label, value, onChange }) => {
    return (
        <div className="flex flex-col">
            <label htmlFor={id} className="text-textPrimary mb-1">{label}</label>
            <textarea
                id={id}
                name={id}
                value={value}
                onChange={onChange}
                className="border rounded px-2 py-1"
            />
        </div>
    );
};

export default TextAreaField;
