import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { storeService } from '../../services/storeService';
import { ratingService } from '../../services/ratingService';
import { authService } from '../../services/authService';
import Navbar from '../../components/Navbar';
import PasswordChangeModal from '../../components/PasswordChangeModal';
import { ErrorMessage, SuccessMessage } from '../../components/Messages';
import StoreCard from './StoreCard';

function UserDashboard() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [stores, setStores] = useState([]);
    const [myRatings, setMyRatings] = useState({});
    const [searchFilters, setSearchFilters] = useState({ name: '', address: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });

    useEffect(() => {
        fetchStores();
        fetchMyRatings();
    }, [searchFilters]);

    const fetchStores = async () => {
        try {
            const data = await storeService.getStores(searchFilters, {});
            setStores(data);
        } catch (err) {
            console.error('Error fetching stores:', err);
        }
    };

    const fetchMyRatings = async () => {
        try {
            const data = await ratingService.getMyRatings();
            setMyRatings(data);
        } catch (err) {
            console.error('Error fetching ratings:', err);
        }
    };

    const handleSearchChange = (e) => {
        setSearchFilters({
            ...searchFilters,
            [e.target.name]: e.target.value
        });
    };

    const handleRatingSubmit = async (storeId, rating) => {
        setError('');
        setSuccess('');

        try {
            if (myRatings[storeId]) {
                await ratingService.updateRating(storeId, rating);
                setSuccess('Rating updated successfully');
            } else {
                await ratingService.submitRating(storeId, rating);
                setSuccess('Rating submitted successfully');
            }
            fetchStores();
            fetchMyRatings();
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError(err.response?.data?.error || 'Rating submission failed');
            setTimeout(() => setError(''), 3000);
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
                title="User Dashboard"
                userName={user?.name}
                onChangePassword={() => setShowPasswordModal(true)}
                onLogout={handleLogout}
            />

            <div className="bg-white rounded-lg p-8 shadow-md mb-6">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">Available Stores</h3>
                <ErrorMessage message={error} />
                <SuccessMessage message={success} />

                <div className="flex gap-4 mb-6">
                    <input
                        type="text"
                        name="name"
                        placeholder="Search by store name"
                        value={searchFilters.name}
                        onChange={handleSearchChange}
                        className="flex-1 p-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Search by address"
                        value={searchFilters.address}
                        onChange={handleSearchChange}
                        className="flex-1 p-4 border border-gray-300 rounded-lg text-base focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {stores.map(store => (
                        <StoreCard
                            key={store.id}
                            store={store}
                            myRating={myRatings[store.id]}
                            onRatingChange={handleRatingSubmit}
                        />
                    ))}
                </div>

                {stores.length === 0 && (
                    <p className="text-center text-gray-600 mt-5">
                        No stores found
                    </p>
                )}
            </div>

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

export default UserDashboard;
