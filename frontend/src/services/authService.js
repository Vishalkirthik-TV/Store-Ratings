import api from '../api/api';

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    signup: async (userData) => {
        const response = await api.post('/auth/signup', userData);
        return response.data;
    },

    updatePassword: async (currentPassword, newPassword) => {
        const response = await api.post('/auth/update-password', {
            currentPassword,
            newPassword
        });
        return response.data;
    }
};
