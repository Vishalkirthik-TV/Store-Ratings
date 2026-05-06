import React from 'react';

function Navbar({ title, userName, onChangePassword, onLogout }) {
    return (
        <div className="bg-white p-6 shadow-sm flex justify-between items-center mb-8 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 m-0">{title}</h2>
            <div className="flex items-center gap-4">
                <span className="font-medium text-gray-600">{userName}</span>
                <button
                    onClick={onChangePassword}
                    className="px-6 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg font-medium transition-all hover:bg-gray-200"
                >
                    Change Password
                </button>
                <button
                    onClick={onLogout}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium transition-all hover:bg-red-600 hover:-translate-y-0.5 hover:shadow-md"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}

export default Navbar;
