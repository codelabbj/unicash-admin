import apiClient from './axios.config';

export const networksAPI = {
    getNetworks: async () => {
        const response = await apiClient.get('/core/admin/networks/');
        // Handle pagination or direct array
        const data = response.data;
        const results = Array.isArray(data) ? data : (data.results || data.data || []);
        return { data: results };
    },

    createNetwork: async (data) => {
        const response = await apiClient.post('/core/admin/networks/', data);
        return response;
    },

    updateNetwork: async (id, data) => {
        const response = await apiClient.patch(`/core/admin/networks/${id}/`, data);
        return response;
    },

    deleteNetwork: async (id) => {
        const response = await apiClient.delete(`/core/admin/networks/${id}/`);
        return response;
    },

    toggleStatus: async (id, currentStatus) => {
        const response = await apiClient.patch(`/core/admin/networks/${id}/`, {
            is_active: !currentStatus
        });
        return response;
    }
};
