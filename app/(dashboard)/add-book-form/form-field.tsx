'use client';
import { useFormContext } from 'react-hook-form';

interface FormFieldProps {
    id: string;
    label: string;
    type?: string;
    required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ id, label, type = 'text', required = false }) => {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div className="flex flex-col">
            <label htmlFor={id} className="text-textPrimary mb-1">{label}</label>
            <input
                id={id}
                type={type}
                {...register(id, { required })}
                className="border rounded px-2 py-1"
            />
            {errors[id] && <span className="text-accent text-xs mt-1">This field is required</span>}
        </div>
    );
};

export default FormField;
