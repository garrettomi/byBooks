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
            <label htmlFor={id}>{label}</label>
            <input
                id={id}
                type={type}
                {...register(id, { required })}
            />
            {errors[id] && <span>This field is required</span>}
        </div>
    );
};

export default FormField;
