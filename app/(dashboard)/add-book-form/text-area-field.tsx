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
            <label htmlFor={id}>{label}</label>
            <textarea
                id={id}
                {...register(id, { required })}
            />
            {errors[id] && <span>This field is required</span>}
        </div>
    );
};

export default TextAreaField;
