import apiClient from './axios.config';

export const bannersAPI = {
    getBanners: async () => {
        const response = await apiClient.get('/core/admin/carousel/');
        const data = response.data;
        const results = Array.isArray(data) ? data : (data.results || data.data || []);
        return { data: results };
    },

    createBanner: async (data) => {
        const config = data instanceof FormData ? {
            headers: { 'Content-Type': 'multipart/form-data' }
        } : {};
        const response = await apiClient.post('/core/admin/carousel/', data, config);
        return response;
    },

    updateBanner: async (id, data) => {
        const config = data instanceof FormData ? {
            headers: { 'Content-Type': 'multipart/form-data' }
        } : {};
        const response = await apiClient.patch(`/core/admin/carousel/${id}/`, data, config);
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
