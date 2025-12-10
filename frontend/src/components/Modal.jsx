import React from 'react';

function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg p-8 max-w-lg w-11/12 max-h-screen overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-xl font-semibold mb-6 text-gray-800">{title}</h3>
                {children}
            </div>
        </div>
    );
}

export default Modal;
