import api from '../api/api';

export const ratingService = {
    submitRating: async (storeId, rating) => {
        const response = await api.post('/ratings', { storeId, rating });
        return response.data;
    },

    updateRating: async (storeId, rating) => {
        const response = await api.put('/ratings', { storeId, rating });
        return response.data;
    },

    getMyRatings: async () => {
        const response = await api.get('/ratings/my-ratings');
        return response.data;
    }
};
