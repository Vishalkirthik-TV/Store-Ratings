import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { storeService } from '../../services/storeService';
import { authService } from '../../services/authService';
import Navbar from '../../components/Navbar';
import PasswordChangeModal from '../../components/PasswordChangeModal';
import { ErrorMessage, SuccessMessage } from '../../components/Messages';
import StoreInfoCard from './StoreInfoCard';
import RatingsTable from './RatingsTable';

function StoreOwnerDashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [storeData, setStoreData] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });

    useEffect(() => {
        fetchStoreData();
        fetchRatings();
    }, []);

    const fetchStoreData = async () => {
        try {
            const data = await storeService.getMyStore();
            setStoreData(data);
        } catch (err) {
            console.error('Error fetching store data:', err);
            setError('Failed to load store data');
        }
    };

    const fetchRatings = async () => {
        try {
            const data = await storeService.getMyStoreRatings();
            setRatings(data);
        } catch (err) {
            console.error('Error fetching ratings:', err);
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
                title="Store Owner Dashboard"
                userName={user?.name}
                onChangePassword={() => setShowPasswordModal(true)}
                onLogout={handleLogout}
            />

            <ErrorMessage message={error} />
            <SuccessMessage message={success} />

            {storeData && (
                <>
                    <StoreInfoCard storeData={storeData} />
                    <RatingsTable ratings={ratings} />
                </>
            )}

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

export default StoreOwnerDashboard;
