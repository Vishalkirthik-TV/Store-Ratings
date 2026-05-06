import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { userService } from '../../services/userService';
import { storeService } from '../../services/storeService';
import { authService } from '../../services/authService';
import Navbar from '../../components/Navbar';
import PasswordChangeModal from '../../components/PasswordChangeModal';
import StatisticsCards from './StatisticsCards';
import UsersTable from './UsersTable';
import StoresTable from './StoresTable';
import CreateModal from './CreateModal';

function AdminDashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
    const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' });
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'user',
        ownerId: ''
    });
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });

    useEffect(() => {
        if (activeTab === 'dashboard') {
            fetchStats();
        } else if (activeTab === 'users') {
            fetchUsers();
        } else if (activeTab === 'stores') {
            fetchStores();
        }
    }, [activeTab, filters, sortConfig]);

    const fetchStats = async () => {
        try {
            const data = await userService.getStats();
            setStats(data);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await userService.getUsers(filters, sortConfig);
            setUsers(data);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const fetchStores = async () => {
        try {
            const data = await storeService.getStores(filters, sortConfig);
            setStores(data);
        } catch (err) {
            console.error('Error fetching stores:', err);
        }
    };

    const handleSort = (key) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
        });
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const handleFormChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const openModal = (type) => {
        setModalType(type);
        setShowModal(true);
        setFormData({
            name: '',
            email: '',
            password: '',
            address: '',
            role: 'user',
            ownerId: ''
        });
        setError('');
        setSuccess('');
    };

    const closeModal = () => {
        setShowModal(false);
        setModalType('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (modalType === 'user') {
                await userService.createUser(formData);
                setSuccess('User created successfully');
                fetchUsers();
                fetchStats();
                setTimeout(closeModal, 1500);
            } else if (modalType === 'store') {
                await storeService.createStore({
                    name: formData.name,
                    email: formData.email,
                    address: formData.address,
                    ownerId: formData.ownerId || null
                });
                setSuccess('Store created successfully');
                fetchStores();
                fetchStats();
                setTimeout(closeModal, 1500);
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Operation failed');
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            await authService.updatePassword(passwordData.currentPassword, passwordData.newPassword);
            setSuccess('Password updated successfully');
            setPasswordData({ currentPassword: '', newPassword: '' });
            setTimeout(() => {
                setShowPasswordModal(false);
                setSuccess('');
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.error || 'Password update failed');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="max-w-7xl mx-auto p-8 bg-gray-50 min-h-screen">
            <Navbar
                title="Admin Dashboard"
                userName={user?.name}
                onChangePassword={() => setShowPasswordModal(true)}
                onLogout={handleLogout}
            />

            <div className="bg-white rounded-lg p-8 shadow-md mb-6">
                <div className="flex gap-2.5 mb-5">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'dashboard'
                            ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-md'
                            : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                            }`}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'users'
                            ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-md'
                            : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                            }`}
                    >
                        Users
                    </button>
                    <button
                        onClick={() => setActiveTab('stores')}
                        className={`px-6 py-2 rounded-lg font-medium transition-all ${activeTab === 'stores'
                            ? 'bg-gradient-to-r from-purple-500 to-purple-700 text-white shadow-md'
                            : 'bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200'
                            }`}
                    >
                        Stores
                    </button>
                </div>

                {activeTab === 'dashboard' && (
                    <div>
                        <h3 className="text-xl font-semibold mb-5 text-gray-800">Statistics</h3>
                        <StatisticsCards stats={stats} />
                    </div>
                )}

                {activeTab === 'users' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold m-0 text-gray-800">Users Management</h3>
                            <button
                                onClick={() => openModal('user')}
                                className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium transition-all hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-md"
                            >
                                Add User
                            </button>
                        </div>
                        <UsersTable
                            users={users}
                            filters={filters}
                            sortConfig={sortConfig}
                            onFilterChange={handleFilterChange}
                            onSort={handleSort}
                        />
                    </div>
                )}

                {activeTab === 'stores' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold m-0 text-gray-800">Stores Management</h3>
                            <button
                                onClick={() => openModal('store')}
                                className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium transition-all hover:bg-green-600 hover:-translate-y-0.5 hover:shadow-md"
                            >
                                Add Store
                            </button>
                        </div>
                        <StoresTable
                            stores={stores}
                            filters={filters}
                            sortConfig={sortConfig}
                            onFilterChange={handleFilterChange}
                            onSort={handleSort}
                        />
                    </div>
                )}
            </div>

            <CreateModal
                isOpen={showModal}
                onClose={closeModal}
                modalType={modalType}
                formData={formData}
                onFormChange={handleFormChange}
                onSubmit={handleSubmit}
                error={error}
                success={success}
            />

            <PasswordChangeModal
                isOpen={showPasswordModal}
                onClose={() => setShowPasswordModal(false)}
                onSubmit={handlePasswordUpdate}
                passwordData={passwordData}
                setPasswordData={setPasswordData}
                error={error}
                success={success}
            />
        </div>
    );
}

export default AdminDashboard;
