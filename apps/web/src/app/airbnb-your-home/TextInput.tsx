import React from 'react';

interface TextInputProps {
    label: string;
    id: string;
    type?: string;
    register: any;
    error?: string;
}

const TextInput: React.FC<TextInputProps> = ({ label, id, type = 'text', register, error }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor={id}>{label}</label>
            <input
                className={`w-full p-2 border rounded-lg ${error ? 'border-red-500' : 'border-gray-300'}`}
                type={type}
                {...register(id)}
            />
            {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
        </div>
    );
};

export default TextInput;
