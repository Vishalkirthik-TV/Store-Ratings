import api from '../api/api';

export const storeService = {
    getStores: async (filters = {}, sortConfig = {}) => {
        const params = new URLSearchParams();
        if (filters.name) params.append('name', filters.name);
        if (filters.address) params.append('address', filters.address);
        if (sortConfig.key) {
            params.append('sortBy', sortConfig.key);
            params.append('sortOrder', sortConfig.direction);
        }

        const response = await api.get(`/stores?${params}`);
        return response.data;
    },

    createStore: async (storeData) => {
        const response = await api.post('/stores', storeData);
        return response.data;
    },

    getMyStore: async () => {
        const response = await api.get('/stores/my-store');
        return response.data;
    },

    getMyStoreRatings: async () => {
        const response = await api.get('/stores/my-store/ratings');
        return response.data;
    }
};
