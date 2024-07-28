import React from 'react';

interface TextAreaInputProps {
    label: string;
    id: string;
    register: any;
    error?: string;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({ label, id, register, error }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={id}>{label}</label>
            <textarea
                className={`w-full p-2 border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}
                {...register(id)}
                rows={4}
            />
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        </div>
    );
};

export default TextAreaInput;
