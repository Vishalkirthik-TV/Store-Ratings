import React from 'react';

function FormInput({ label, type = 'text', name, value, onChange, required = false, helpText }) {
    return (
        <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-800">{label}</label>
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full p-4 border border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
            />
            {helpText && (
                <small className="text-gray-600 text-xs">{helpText}</small>
            )}
        </div>
    );
}

function FormTextarea({ label, name, value, onChange, required = false, helpText }) {
    return (
        <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-800">{label}</label>
            <textarea
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full p-4 border border-gray-300 rounded-lg text-base min-h-[100px] resize-y transition-colors focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
            />
            {helpText && (
                <small className="text-gray-600 text-xs">{helpText}</small>
            )}
        </div>
    );
}

function FormSelect({ label, name, value, onChange, options, required = false }) {
    return (
        <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-800">{label}</label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className="w-full p-4 border border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export { FormInput, FormTextarea, FormSelect };
