import apiClient from './axios.config';

export const aggregatorsAPI = {
    getAggregators: async () => {
        const response = await apiClient.get('/core/admin/payment-aggregators/');
        const data = response.data;
        const results = Array.isArray(data) ? data : (data.results || data.data || []);
        return { data: results };
    },

    createAggregator: async (data) => {
        const response = await apiClient.post('/core/admin/payment-aggregators/', data);
        return response;
    },

    updateAggregator: async (id, data) => {
        const response = await apiClient.patch(`/core/admin/payment-aggregators/${id}/`, data);
        return response;
    },

    deleteAggregator: async (id) => {
        const response = await apiClient.delete(`/core/admin/payment-aggregators/${id}/`);
        return response;
    },

    toggleStatus: async (id, currentStatus) => {
        const response = await apiClient.patch(`/core/admin/payment-aggregators/${id}/`, {
            is_active: !currentStatus
        });
        return response;
    }
};
