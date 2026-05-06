import React from 'react';

export function ErrorMessage({ message }) {
    if (!message) return null;
    return (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-900 p-4 rounded-lg mb-4 font-medium">
            {message}
        </div>
    );
}

export function SuccessMessage({ message }) {
    if (!message) return null;
    return (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-900 p-4 rounded-lg mb-4 font-medium">
            {message}
        </div>
    );
}
