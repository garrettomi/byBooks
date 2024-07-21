const FormField = ({ label, name, value, onChange, isTextArea = false }: {
    label: string,
    name: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    isTextArea?: boolean
}) => {
    return (
        <div className="flex flex-col">
            <label className="text-textPrimary mb-1">{label}</label>
            {isTextArea ? (
                <textarea name={name} value={value} onChange={onChange}></textarea>
            ) : (
                <input type="text" name={name} value={value} onChange={onChange} className="border rounded px-2 py-1" />
            )}
        </div>
    );
};

export default FormField;
