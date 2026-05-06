import React from 'react';
import Modal from './Modal';
import { ErrorMessage, SuccessMessage } from './Messages';

function PasswordChangeModal({
    isOpen,
    onClose,
    onSubmit,
    passwordData,
    setPasswordData,
    error,
    success
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Change Password">
            <ErrorMessage message={error} />
            <SuccessMessage message={success} />
            <form onSubmit={onSubmit}>
                <div className="mb-6">
                    <label className="block mb-2 font-medium text-gray-800">Current Password</label>
                    <input
                        type="password"
                        className="w-full p-4 border border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                            setPasswordData({ ...passwordData, currentPassword: e.target.value })
                        }
                        required
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 font-medium text-gray-800">New Password</label>
                    <input
                        type="password"
                        className="w-full p-4 border border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                        value={passwordData.newPassword}
                        onChange={(e) =>
                            setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                        required
                    />
                    <small className="text-gray-600 text-xs">
                        8-16 chars, one uppercase, one special char
                    </small>
                </div>
                <div className="flex gap-4 justify-end mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="min-w-[100px] px-6 py-2 bg-gray-100 text-gray-800 border border-gray-300 rounded-lg font-medium transition-all hover:bg-gray-200"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="min-w-[100px] px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white rounded-lg font-medium transition-all hover:-translate-y-0.5 hover:shadow-md"
                    >
                        Update Password
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default PasswordChangeModal;
