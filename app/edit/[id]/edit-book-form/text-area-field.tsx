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
            <label htmlFor={id}>{label}</label>
            <textarea
                id={id}
                name={id}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default TextAreaField;
