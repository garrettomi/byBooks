'use client';
import { useFormContext } from 'react-hook-form';

interface TextAreaFieldProps {
    id: string;
    label: string;
    required?: boolean;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({ id, label, required = false }) => {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="flex flex-col">
            <label htmlFor={id} className="text-textPrimary mb-1">{label}</label>
            <textarea
                id={id}
                {...register(id, { required })}
                className="border rounded px-2 py-1"
            />
            {errors[id] && <span className="text-accent text-xs mt-1">This field is required</span>}
        </div>
    );
};

export default TextAreaField;
