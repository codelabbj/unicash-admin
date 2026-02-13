import apiClient from './axios.config';

export const bannersAPI = {
    getBanners: async () => {
        const response = await apiClient.get('/core/carousel/');
        const data = response.data;
        const results = Array.isArray(data) ? data : (data.results || data.data || []);
        return { data: results };
    },

    createBanner: async (data) => {
        const response = await apiClient.post('/core/admin/carousel/', data);
        return response;
    },

    updateBanner: async (id, data) => {
        const response = await apiClient.patch(`/core/admin/carousel/${id}/`, data);
        return response;
    },

    deleteBanner: async (id) => {
        const response = await apiClient.delete(`/core/admin/carousel/${id}/`);
        return response;
    },

    toggleStatus: async (id, currentStatus) => {
        const response = await apiClient.patch(`/core/admin/carousel/${id}/`, {
            is_active: !currentStatus
        });
        return response;
    }
};
