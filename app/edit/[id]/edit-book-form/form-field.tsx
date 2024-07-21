const FormField = ({ label, name, value, onChange, isTextArea = false }: {
    label: string,
    name: string,
    value: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    isTextArea?: boolean
}) => {
    return (
        <div>
            <label>{label}</label>
            {isTextArea ? (
                <textarea name={name} value={value} onChange={onChange}></textarea>
            ) : (
                <input type="text" name={name} value={value} onChange={onChange} />
            )}
        </div>
    );
};

export default FormField;
