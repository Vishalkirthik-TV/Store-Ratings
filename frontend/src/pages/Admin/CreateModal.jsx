import React from 'react';
import Modal from '../../components/Modal';
import { ErrorMessage, SuccessMessage } from '../../components/Messages';

function CreateModal({ isOpen, onClose, modalType, formData, onFormChange, onSubmit, error, success }) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={modalType === 'user' ? 'Add New User' : 'Add New Store'}>
            <ErrorMessage message={error} />
            <SuccessMessage message={success} />
            <form onSubmit={onSubmit}>
                <div className="mb-6">
                    <label className="block mb-2 font-medium text-gray-800">Name (20-60 characters)</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={onFormChange}
                        required
                        className="w-full p-4 border border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                    />
                </div>
                <div className="mb-6">
                    <label className="block mb-2 font-medium text-gray-800">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={onFormChange}
                        required
                        className="w-full p-4 border border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                    />
                </div>
                {modalType === 'user' && (
                    <>
                        <div className="mb-6">
                            <label className="block mb-2 font-medium text-gray-800">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={onFormChange}
                                required
                                className="w-full p-4 border border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                            />
                            <small className="text-gray-600 text-xs">
                                8-16 chars, one uppercase, one special char
                            </small>
                        </div>
                        <div className="mb-6">
                            <label className="block mb-2 font-medium text-gray-800">Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={onFormChange}
                                className="w-full p-4 border border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                                <option value="store_owner">Store Owner</option>
                            </select>
                        </div>
                    </>
                )}
                <div className="mb-6">
                    <label className="block mb-2 font-medium text-gray-800">Address (max 400 characters)</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={onFormChange}
                        required
                        className="w-full p-4 border border-gray-300 rounded-lg text-base min-h-[100px] resize-y transition-colors focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                    />
                </div>
                {modalType === 'store' && (
                    <div className="mb-6">
                        <label className="block mb-2 font-medium text-gray-800">Owner ID (optional)</label>
                        <input
                            type="number"
                            name="ownerId"
                            value={formData.ownerId}
                            onChange={onFormChange}
                            className="w-full p-4 border border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                        />
                    </div>
                )}
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
                        Create
                    </button>
                </div>
            </form>
        </Modal>
    );
}

export default CreateModal;
