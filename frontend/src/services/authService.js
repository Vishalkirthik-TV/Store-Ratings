import api from '../api/api';

// Authentication Services
export const authService = {
    // User login
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    // User signup
    signup: async (userData) => {
        const response = await api.post('/auth/signup', userData);
        return response.data;
    },

    // Update password
    updatePassword: async (currentPassword, newPassword) => {
        const response = await api.post('/auth/update-password', {
            currentPassword,
            newPassword
        });
        return response.data;
    }
};
