import api from '../api/api';

// User Management Services
export const userService = {
    // Get dashboard statistics
    getStats: async () => {
        const response = await api.get('/users/stats/dashboard');
        return response.data;
    },

    // Get all users with filters and sorting
    getUsers: async (filters = {}, sortConfig = {}) => {
        const params = new URLSearchParams();
        if (filters.name) params.append('name', filters.name);
        if (filters.email) params.append('email', filters.email);
        if (filters.address) params.append('address', filters.address);
        if (filters.role) params.append('role', filters.role);
        if (sortConfig.key) {
            params.append('sortBy', sortConfig.key);
            params.append('sortOrder', sortConfig.direction);
        }

        const response = await api.get(`/users?${params}`);
        return response.data;
    },

    // Create new user
    createUser: async (userData) => {
        const response = await api.post('/users', userData);
        return response.data;
    },

    // Get user by ID
    getUser: async (userId) => {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    }
};
