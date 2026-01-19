import apiClient from './axios.config';

export const bannersAPI = {
    getBanners: async () => {
        const response = await apiClient.get('/core/banners/');
        const data = response.data;
        const results = Array.isArray(data) ? data : (data.results || data.data || []);
        return { data: results };
    },

    createBanner: async (data) => {
        const response = await apiClient.post('/core/banners/', data);
        return response;
    },

    updateBanner: async (id, data) => {
        const response = await apiClient.patch(`/core/banners/${id}/`, data);
        return response;
    },

    deleteBanner: async (id) => {
        const response = await apiClient.delete(`/core/banners/${id}/`);
        return response;
    },

    toggleStatus: async (id, currentStatus) => {
        const response = await apiClient.patch(`/core/banners/${id}/`, {
            is_active: !currentStatus
        });
        return response;
    }
};
